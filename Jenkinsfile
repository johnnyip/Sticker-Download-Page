pipeline {
  agent any
  options { skipDefaultCheckout(true); disableConcurrentBuilds(); timestamps(); timeout(time: 20, unit: 'MINUTES'); buildDiscarder(logRotator(numToKeepStr: '30')) }
  environment {
    HOST_JENKINS_WORKSPACE = '/home/johnny/docker/jenkins-workspace'
    DEPLOY_DIR = '/volume2/docker/wordpress-johnnyip/wp-content/reactpress/apps/sticker'
    WORDPRESS_CONTAINER = '20-content-01-wordpress-johnnyip-1'
    DEPLOY_URL = 'https://johnnyip.com/sticker/'
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build and Deploy') { steps { sh '''set -eu
      host_source=$(printf '%s' "$PWD" | sed "s#^/var/jenkins_home/workspace#$HOST_JENKINS_WORKSPACE#")
      docker run --rm -v "$host_source:/source:ro" -v "$DEPLOY_DIR:/deploy" -w /workspace node:20-alpine sh -lc '
        cp -a /source/. /workspace
        npm ci
        npm run build
        mkdir -p /deploy/build
        find /deploy/build -mindepth 1 -exec rm -rf {} +
        cp -R ./build/. /deploy/build/
        find /deploy/build -maxdepth 3 -type f | sort
      '
    ''' } }
    stage('Purge and Verify Cache') { steps { sh '''set -eu
      docker exec \
        -e HTTP_HOST=johnnyip.com \
        -e HTTPS=on \
        "$WORDPRESS_CONTAINER" \
        php -r 'require "/opt/bitnami/wordpress/wp-load.php"; w3tc_flush_url("https://johnnyip.com/sticker/");'

      docker run --rm -i \
        -e DEPLOY_URL="$DEPLOY_URL" \
        -v "$DEPLOY_DIR:/deploy:ro" \
        node:20-alpine node - <<'NODE'
const fs = require('node:fs');

const manifest = JSON.parse(fs.readFileSync('/deploy/build/asset-manifest.json', 'utf8'));
const expected = [manifest.files.mainJs, manifest.files.mainCss]
  .map((path) => path.replace(/^\//, ''));

if (expected.length !== 2 || expected.some((path) => !path)) {
  throw new Error('asset-manifest.json does not contain mainJs and mainCss');
}

(async () => {
  const response = await fetch(process.env.DEPLOY_URL, {
    headers: { 'User-Agent': 'Jenkins-Sticker-Deploy-Verification/1.0' },
  });
  const html = await response.text();

  if (!response.ok) {
    throw new Error(`Deployment URL returned HTTP ${response.status}`);
  }

  for (const asset of expected) {
    if (!html.includes(asset)) {
      throw new Error(`Deployment HTML does not reference ${asset}`);
    }
  }

  if (!html.includes('id="root"')) {
    throw new Error('Deployment HTML does not contain the React root element');
  }

  console.log(`Verified ${process.env.DEPLOY_URL}`);
  console.log(`JavaScript: ${expected[0]}`);
  console.log(`CSS: ${expected[1]}`);
  console.log(`Cache-Control: ${response.headers.get('cache-control') || '(none)'}`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
NODE
    ''' } }
  }
  post { always { step([$class: 'Mailer', recipients: 'johnny@johnnyip.com', notifyEveryUnstableBuild: false, sendToIndividuals: false]); cleanWs deleteDirs: true, disableDeferredWipeout: true, notFailBuild: true } }
}
