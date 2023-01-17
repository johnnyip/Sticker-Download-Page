import { useState, useEffect } from 'react';
import { Accordion, Text, Button } from '@mantine/core';
import { IconBrandWhatsapp, IconBrandTelegram, IconMessageCircle2 } from '@tabler/icons';

import { setCookies, getCookies } from '../functions/cookie';

import Introduction from './introduction';
import Whatsapp from './platforms/whatsapp';
import Signal from './platforms/signal';
import Telegram from './platforms/telegram';

export default function MainTable() {
    const [installed, setInstalled] = useState([])
    const [needUpdate, setNeedUpdate] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        const fetchCookie = async () => {
            let installed_cookie = await getCookies()
            if (installed_cookie !== undefined) {
                installed_cookie = installed_cookie.split(',')
                console.log(installed_cookie)
                setInstalled(installed_cookie)
            }
        }

        if (needUpdate) {
            setNeedUpdate(false)
            setCookies(installed)
        }

        if (firstLoad) {
            fetchCookie()
            setFirstLoad(false)
        }
    })


    return (
        <div className="main center" >

            <h2>最新最齊 ㄇㄚˊ幾兔 Machiko 貼圖 Sticker 動態 Animated</h2>

            <Introduction />

            <hr />

            總計超過750款Sticker! <br />
            所有<u>動態</u>及<u>靜態</u>貼圖現已合拼於同一貼圖包內 <br /><br />
            [WhatsApp及Telegram]<br />貼圖包已根據貼圖用途作分類
            <br /><br />

            <Accordion  >
                <Accordion.Item value="whatsapp">
                    <Accordion.Control >
                        <div className='center'>
                            <IconBrandWhatsapp className='space' color='green' size={20} />
                            WhatsApp
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
                            Signal
                        </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Whatsapp
                            installed={installed}
                            setInstalled={setInstalled}
                            setNeedUpdate={setNeedUpdate} />
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="telegram">
                    <Accordion.Control >
                        <div className='center'>
                            <IconBrandTelegram className='space' color='blue' size={20} />
                            Telegram (新)
                        </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Whatsapp
                            installed={installed}
                            setInstalled={setInstalled}
                            setNeedUpdate={setNeedUpdate} />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

            <br />
            <Text>本頁使用Cookies，用作標記已下載的貼圖包。<br/>
            每次點選下載時，會自動標記為綠色(已下載)</Text>
            <Button color={"gray"}
                onClick={() => {
                    setInstalled("")
                    setNeedUpdate(true)
                }}>重設Cookies(綠色已下載標記)</Button>


        </div>
    );
}
