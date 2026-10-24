// Offline: no server, external requests, or download-link clicks.
// PLAYWRIGHT_MODULE=/absolute/playwright/index.mjs node tests/reset-regression.mjs BUILD WRAPPER EMOJI [--expect-baseline-failure]
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [buildArg, wrapperArg, emojiArg, mode] = process.argv.slice(2);
assert(buildArg && wrapperArg && emojiArg, 'Provide build directory, saved WordPress wrapper and emoji script');
assert(process.env.PLAYWRIGHT_MODULE, 'Provide an externally installed Playwright module');
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const build = path.resolve(buildArg);
const wrapper = await fs.readFile(wrapperArg, 'utf8');
const emoji = await fs.readFile(emojiArg, 'utf8');
const manifest = JSON.parse(await fs.readFile(path.join(build, 'asset-manifest.json')));
const baseline = mode === '--expect-baseline-failure';
const browser = await chromium.launch({ headless: true });
const report = [];
try {
  for (const width of [1280, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    const consoleErrors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (request.isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: wrapper });
      if (url.pathname.endsWith('.js')) {
        const isApp = url.pathname.includes('/build/static/js/');
        return route.fulfill({ contentType: 'text/javascript', body: isApp ? await fs.readFile(path.join(build, manifest.files.mainJs)) : '' });
      }
      if (url.pathname.includes('/build/static/css/')) return route.fulfill({ contentType: 'text/css', body: await fs.readFile(path.join(build, manifest.files.mainCss)) });
      if (url.hostname === 'api.github.com') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ pushed_at: '2026-10-24T00:00:00Z' }) });
      if (request.resourceType() === 'image') return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"/>' });
      return route.fulfill({ contentType: 'text/css', body: '' });
    });
    const root = page.locator('#root').first();
    const counts = async full => {
      for (const [platform, total] of [['WhatsApp',45],['Signal',17],['Telegram',37]]) {
        await page.waitForFunction(({ platform, total, full }) => [...document.querySelectorAll('#root button')].some(b => b.textContent.includes(platform + ' (已下載 ' + (full ? total : 0) + '/' + total + ')')), { platform, total, full });
      }
      assert(await root.locator('button').count() > 0, 'React root remains mounted');
    };
    const markAll = () => page.getByRole('button', { name: '全部標記為已下載', exact: true }).click();
    const reset = () => page.getByRole('button', { name: '重設Cookies(綠色已下載標記)', exact: true }).click();
    const startEmoji = async () => {
      // Force the WordPress fallback path even on platforms with native emoji support.
      await page.evaluate(() => { window._wpemojiSettings = { supports: { everything: false, everythingExceptFlag: false }, svgUrl: 'http://127.0.0.1/emoji/', svgExt: '.svg' }; });
      await page.addScriptTag({ content: emoji });
    };
    await page.goto('http://127.0.0.1/new/');
    await counts(false);
    const linkTotals = {};
    for (const [platform, total] of [['whatsapp', 45], ['signal', 17], ['telegram', 37]]) {
      const links = JSON.parse(await fs.readFile(new URL('../src/data/' + platform + '.json', import.meta.url)));
      assert.equal(links.length, total);
      for (const item of links) {
        for (const href of [item.url, item.url2].filter(Boolean)) {
          assert(await root.locator('a').evaluateAll((anchors, href) => anchors.filter(a => a.getAttribute('href') === href).length >= 2, href), 'Desktop/mobile download href preserved: ' + href);
        }
      }
      linkTotals[platform] = total;
    }
    await markAll();
    await counts(true);
    await startEmoji();
    await page.waitForFunction(() => document.querySelectorAll('#root img.emoji[alt="✅"]').length === 99);
    const transformed = await root.locator('img.emoji[alt="✅"]').count();
    await reset();
    if (baseline) {
      await page.waitForFunction(() => document.querySelector('#root').childElementCount === 0);
      assert(errors.some(e => /removeChild/.test(e)), 'Baseline must reproduce removeChild error');
      report.push({ width, transformed, rootEmpty: true, errors });
    } else {
      await counts(false);
      await reset();
      await counts(false);
      await page.reload();
      await counts(false);
      await startEmoji();
      await markAll();
      await counts(true);
      await page.waitForFunction(() => document.querySelectorAll('#root img.emoji[alt="✅"]').length === 99);
      await page.reload();
      await counts(true);
      await startEmoji();
      await page.waitForFunction(() => document.querySelectorAll('#root img.emoji[alt="✅"]').length === 99);
      await reset();
      await counts(false);
      await reset();
      await counts(false);
      assert.deepEqual(errors, []);
      assert.deepEqual(consoleErrors, []);
      report.push({ width, transformed, linkTotals, fullToEmpty: true, repeatedReset: true, emptyReload: true, markAllReload: true, errors, consoleErrors });
    }
    await context.close();
  }
  console.log(JSON.stringify({ baseline, report }, null, 2));
} finally { await browser.close(); }
