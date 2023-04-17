import { useState, useEffect } from 'react';
import { Accordion, Text, Button, Badge, Group } from '@mantine/core';
import { IconBrandWhatsapp, IconBrandTelegram, IconMessageCircle2, IconBrandGithub } from '@tabler/icons';
import moment from 'moment';
import { Adsense } from '@ctrl/react-adsense';

import { setCookies, getCookies } from '../functions/cookie';
import { fetchGitHubRepoData } from '../functions/github';

import WhatsappLink from '../data/whatsapp.json'
import TelegramLink from '../data/telegram.json'
import SignalLink from '../data/signal.json'

import Introduction from './introduction';
import Whatsapp from './platforms/whatsapp';
import Signal from './platforms/signal';
import Telegram from './platforms/telegram';

export default function MainTable() {
    // const lastUpdate = "2023-03-16 05:30"
    const [lastUpdate, setLastUpdate] = useState(new Date(""))
    const [installed, setInstalled] = useState([])
    const [needUpdate, setNeedUpdate] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)
    const [downlaodedCount, setDownlaodedCount] = useState(
        { "what": 0, "tg": 0, "signal": 0 })
    const [totalCount, setTotalCount] = useState(
        { "what": 0, "tg": 0, "signal": 0 })

    const countDownloaded = (installedArr) => {
        let uniqueItems = [...new Set(installedArr)]
        console.log(uniqueItems.length + ", " + installedArr.length)
        let count = { "what": 0, "tg": 0, "signal": 0 }
        uniqueItems.forEach((item) => {
            if (item.includes("what_"))
                count.what += 1;
            else if (item.includes("tg_"))
                count.tg += 1;
            else if (item.includes("signal_"))
                count.signal += 1;
        })
        console.log(count)
        setDownlaodedCount(count)
        return count;
    }

    const countTotal = () => {
        let totalCount_ = { "what": 0, "tg": 0, "signal": 0 }
        totalCount_.what = WhatsappLink.length
        totalCount_.tg = TelegramLink.length
        totalCount_.signal = SignalLink.length
        setTotalCount(totalCount_)
    }

    useEffect(() => {
        const fetchCookie = async () => {
            let installed_cookie = await getCookies()
            if (installed_cookie !== undefined) {
                installed_cookie = installed_cookie.split(',')
                console.log(installed_cookie)
                setInstalled(installed_cookie)
                setNeedUpdate(true)
            }
        }

        const fetchDate = async () => {
            let date = await fetchGitHubRepoData()
            console.log(date)
            setLastUpdate(new Date(date))
        }


        if (firstLoad) {
            fetchCookie()
            countTotal()
            fetchDate()
            setFirstLoad(false)
        }

        if (needUpdate) {
            setNeedUpdate(false)
            countDownloaded(installed)
            setCookies(installed)
        }
    })


    return (
        <div className="main center" >

            <h2>最新最齊 ㄇㄚˊ幾兔 Machiko 貼圖 Sticker 動態 Animated</h2>

            <Introduction />

            <hr />

            總計超過750款Sticker! <br />
            所有<u>動態</u>及<u>靜態</u>貼圖現已合拼於同一貼圖包內 <br /><br />
            <i>網站現已增設廣告，用作維持伺服器運作、貼圖包整合及網頁開發成本。</i><br />


            <hr />
            <Group position="center">
                <Text>最後更新：</Text>
                <Badge variant="outline" radius="xs">{moment(lastUpdate).format('YYYY-MMMM-DD hh:mm')}</Badge>
                <Badge variant="filled" color="red" radius="xs">
                    {moment(lastUpdate, "YYYY-MM-DD hh:mm").fromNow()}
                </Badge>
            </Group>


            <br /><br />
            <a target="_blank" href="https://t.me/johnnyip_stickerbot" rel="noopener">
                <Button leftIcon={<IconBrandTelegram />}>貼圖包快速下載連結Bot[只限Telegram貼圖]</Button>
            </a>

            <br /><br />

            <Accordion  >
                <Accordion.Item value="whatsapp">
                    <Accordion.Control >
                        <div className='center'>
                            <IconBrandWhatsapp className='space' color='green' size={20} />
                            WhatsApp (已下載 {downlaodedCount.what}/{totalCount.what})
                        </div>
                    </Accordion.Control>

                    <Accordion.Panel>
                        <Whatsapp
                            installed={installed}
                            setInstalled={setInstalled}
                            setNeedUpdate={setNeedUpdate} />
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="signal">
                    <Accordion.Control  >
                        <div className='center'>
                            <IconMessageCircle2 className='space' color='blue' size={20} />
                            Signal  (已下載 {downlaodedCount.signal}/{totalCount.signal})
                        </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Signal
                            installed={installed}
                            setInstalled={setInstalled}
                            setNeedUpdate={setNeedUpdate} />
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="telegram">
                    <Accordion.Control >
                        <div className='center'>
                            <IconBrandTelegram className='space' color='blue' size={20} />
                            Telegram (已下載 {downlaodedCount.tg}/{totalCount.tg})
                        </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Telegram
                            installed={installed}
                            setInstalled={setInstalled}
                            setNeedUpdate={setNeedUpdate} />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

            <br />
            <Text>本頁使用Cookies，用作標記已下載的貼圖包。<br />
                每次點選下載時，會自動標記為綠色(已下載)</Text>
            <Button color={"gray"}
                onClick={() => {
                    setInstalled("")
                    setNeedUpdate(true)
                    window.location.reload();
                }}>重設Cookies(綠色已下載標記)</Button>

            <hr />
            特別鳴謝<br />
            <a href='https://github.com/laggykiller/sticker-convert' target='_blank'>
                <Button
                    leftIcon={<IconBrandGithub />}>
                    laggykiller/sticker-convert <br />(貼圖跨應用程式上下載工具，香港人製作)
                </Button>
            </a><br /><br /><br />

            <hr />
            如有任何問題，歡迎到FB Group留言提出!

            <Adsense
                client="ca-pub-4090876297549969"
                slot="6275668077"
            />
            <Adsense
                client="ca-pub-4090876297549969"
                slot="6275668077"
            />

        </div>
    );
}
