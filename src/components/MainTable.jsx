import { useEffect, useState } from 'react';
import { Accordion, Badge, Button, Group, Text } from '@mantine/core';
import {
  IconBrandGithub,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconMessageCircle2,
} from '@tabler/icons-react';

import { clearDownloadedCookie, getDownloadedCookie, setDownloadedCookie } from '../functions/cookie';
import { fetchGitHubRepoData } from '../functions/github';
import { formatHongKongTimestamp, formatRelativeTimeFromNow } from '../functions/date';

import whatsappLinks from '../data/whatsapp.json';
import telegramLinks from '../data/telegram.json';
import signalLinks from '../data/signal.json';

import Introduction from './Introduction.jsx';
import PlatformSection from './platforms/PlatformSection.jsx';

const PLATFORM_CONFIGS = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    countKey: 'what',
    idPrefix: 'what_',
    icon: IconBrandWhatsapp,
    iconColor: 'green',
    links: whatsappLinks,
    infoButtonLabel: '說明(早前已安裝的用戶)及常見問題',
    modalTitle: '說明(早前已安裝的用戶)及常見問題',
    modalContent: (
      <>
        由於原有使用的{' '}
        <a href="https://whatsticker.online" target="_blank" rel="noreferrer">
          <u>Whatsticker</u>
        </a>{' '}
        安裝貼圖時太多廣告，現已轉為另一較少廣告平台{' '}
        <a href="https://getstickerpack.com" target="_blank" rel="noreferrer">
          <u>Sticker Maker</u>
        </a>
        。
        <br />
        <br />
        貼圖由以往動態靜態分開，變成可以混合於同一貼圖包內。建議早前已安裝的用戶將貼圖包全數刪除後重新安裝。
        <br />
        <br />
        <hr />
        <b>iOS用家無法打開App下載頁</b>
        <br />
        <br />
        如於下載頁面按下[Install Sticker]後，即使已安裝程式亦出現左邊畫面，可依照下圖指示修復問題。
        <br />
        <img
          src="https://johnnyip.com/wp-content/uploads/2023/01/fix_1.png"
          width="50%"
          alt="iOS sticker install fix step 1"
        />
        <img
          src="https://johnnyip.com/wp-content/uploads/2023/01/fix_2.png"
          width="50%"
          alt="iOS sticker install fix step 2"
        />
      </>
    ),
  },
  {
    key: 'signal',
    label: 'Signal',
    countKey: 'signal',
    idPrefix: 'signal_',
    icon: IconMessageCircle2,
    iconColor: 'blue',
    links: signalLinks,
    infoButtonLabel: 'Signal Emoji 快捷表情',
    modalTitle: 'Signal Emoji 快捷表情',
    modalContent: (
      <img
        src="https://johnnyip.com/wp-content/uploads/2023/01/Screenshot-2023-01-17-at-9.43.24-PM.png"
        alt="Signal Emoji 快捷表情示意圖"
      />
    ),
  },
  {
    key: 'telegram',
    label: 'Telegram',
    countKey: 'tg',
    idPrefix: 'tg_',
    icon: IconBrandTelegram,
    iconColor: 'blue',
    links: telegramLinks,
    extraButton: {
      href: 'https://t.me/johnnyip_stickerbot',
      label: '貼圖包快速下載連結Bot',
      icon: IconBrandTelegram,
    },
  },
];

function countDownloads(installedIds) {
  const uniqueInstalled = new Set(installedIds);
  const counts = { what: 0, tg: 0, signal: 0 };

  uniqueInstalled.forEach((item) => {
    if (item.startsWith('what_')) {
      counts.what += 1;
    } else if (item.startsWith('tg_')) {
      counts.tg += 1;
    } else if (item.startsWith('signal_')) {
      counts.signal += 1;
    }
  });

  return counts;
}

function collectAllStickerIds() {
  return PLATFORM_CONFIGS.flatMap((platform) => (
    platform.links.map((item) => `${platform.idPrefix}${item.name.replace('Machiko', '')}`)
  ));
}

export default function MainTable() {
  const [lastUpdate, setLastUpdate] = useState('');
  const [installed, setInstalled] = useState([]);

  useEffect(() => {
    setInstalled(getDownloadedCookie());

    const fetchDate = async () => {
      const date = await fetchGitHubRepoData();
      setLastUpdate(date);
    };

    fetchDate();
  }, []);

  useEffect(() => {
    setDownloadedCookie(installed);
  }, [installed]);

  const downloadCounts = countDownloads(installed);

  const totals = {
    what: whatsappLinks.length,
    tg: telegramLinks.length,
    signal: signalLinks.length,
  };
  const allStickerIds = collectAllStickerIds();

  return (
    <div className="main center">
      <h2>最新最齊 ㄇㄚˊ幾兔 Machiko 貼圖 Sticker 動態 Animated</h2>

      <Introduction />

      <hr />

      總計超過750款Sticker! <br />
      所有<u>動態</u>及<u>靜態</u>貼圖現已合拼於同一貼圖包內 <br />
      <br />

      <hr />
      <Group position="center">
        <Text>最後更新：</Text>
        <Badge variant="outline" radius="xs">
          {formatHongKongTimestamp(lastUpdate)}
        </Badge>
        <Badge variant="filled" color="red" radius="xs">
          {formatRelativeTimeFromNow(lastUpdate)}
        </Badge>
      </Group>

      <br />
      <br />
      <a target="_blank" href="https://t.me/johnnyip_stickerbot" rel="noreferrer">
        <Button leftIcon={<IconBrandTelegram />}>貼圖包快速下載連結Bot[只限Telegram貼圖]</Button>
      </a>

      <br />
      <br />

      <Accordion>
        {PLATFORM_CONFIGS.map((platform) => {
          const Icon = platform.icon;

          return (
            <Accordion.Item key={platform.key} value={platform.key}>
              <Accordion.Control>
                <div className="center">
                  <Icon className="space" color={platform.iconColor} size={20} />
                  {platform.label} (已下載 {downloadCounts[platform.countKey]}/{totals[platform.countKey]})
                </div>
              </Accordion.Control>

              <Accordion.Panel>
                <PlatformSection
                  links={platform.links}
                  idPrefix={platform.idPrefix}
                  installed={installed}
                  setInstalled={setInstalled}
                  extraButton={platform.extraButton}
                  infoButtonLabel={platform.infoButtonLabel}
                  modalTitle={platform.modalTitle}
                  modalContent={platform.modalContent}
                />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>

      <br />
      <Text>
        本頁使用Cookies，用作標記已下載的貼圖包。
        <br />
        每次點選下載時，會自動標記為綠色(已下載)
      </Text>
      <Group position="center">
        <Button
          color="gray"
          onClick={() => {
            clearDownloadedCookie();
            setInstalled([]);
          }}
        >
          重設Cookies(綠色已下載標記)
        </Button>
        <Button
          color="green"
          onClick={() => {
            setInstalled(allStickerIds);
          }}
        >
          全部標記為已下載
        </Button>
      </Group>

      <hr />
      特別鳴謝
      <br />
      <a href="https://github.com/laggykiller/sticker-convert" target="_blank" rel="noreferrer">
        <Button leftIcon={<IconBrandGithub />}>
          laggykiller/sticker-convert <br />
          (貼圖跨應用程式上下載工具，香港人製作)
        </Button>
      </a>
      <br />
      <br />
      <br />

      <hr />
    </div>
  );
}
