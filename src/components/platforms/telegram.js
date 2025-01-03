import { useState } from 'react';
import { Modal, Button, SimpleGrid, Group, Accordion } from '@mantine/core';
import { IconArrowsDownUp, IconBrandTelegram, IconEyeOff, IconEye } from '@tabler/icons'

import TelegramLink_ from '../../data/telegram.json'
import LinkCard from './card';
import LinkCardMobile from './cardMobile';

export default function Telegram(props) {
    let installed = props.installed
    let setInstalled = props.setInstalled
    let setNeedUpdate = props.setNeedUpdate

    const [modalOpen, setModalOpen] = useState(false)
    const [links, setLinks] = useState(TelegramLink_)
    const [reverseOrder, setReverseOrder] = useState(true)
    const [activeTab, setActiveTab] = useState("")
    const [showNotInstalled, setShowNotInstalled] = useState(false)

    const setDownloaded = (id) => {
        let tmp_installed = installed
        if (!tmp_installed.includes(id)) {
            tmp_installed.push(id)
            setInstalled(tmp_installed)
            setNeedUpdate(true)
        }
        console.log(tmp_installed)
    }


    return (
        <>
            <hr />
            {/* <Button leftIcon={<IconInfoCircle />} onClick={() => { setModalOpen(true) }}>
                說明(早前已安裝的用戶)
            </Button><br /><br /> */}

            <Group position="center">
                <Button
                    color="gray"
                    leftIcon={<IconArrowsDownUp />}
                    onClick={() => {
                        setReverseOrder(!reverseOrder)
                        setLinks(links.reverse())
                    }}>
                    倒轉顯示順序
                </Button>
                <Button
                    color="gray"
                    leftIcon={showNotInstalled ? <IconEye /> : <IconEyeOff />}
                    onClick={() => {
                        setShowNotInstalled(!showNotInstalled)
                    }}>
                    {showNotInstalled ? "顯示所有貼圖" : "只顯示未安裝貼圖"}
                </Button>

            </Group>
            <a target="_blank" href="https://t.me/johnnyip_stickerbot" rel="noopener">
                <Button leftIcon={<IconBrandTelegram />}>貼圖包快速下載連結Bot</Button>
            </a><br />

            <hr />

            <SimpleGrid cols={4}>
                {[...links].map((item, i) => {
                    let id = item.name.split("Machiko")[1]
                    if (!showNotInstalled || (showNotInstalled && !installed.includes(`tg_${id}`))) {
                        return (
                            <div key={id} className="link-card-desktop">
                                <LinkCard
                                    data={item}
                                    key={`tg_${id}`}
                                    id={`tg_${id}`}
                                    idHeader={`tg_`}
                                    installed={installed.includes(`tg_${id}`)}
                                    setDownloaded={setDownloaded} />
                            </div>
                        )

                    }
                })}
            </SimpleGrid>
            <SimpleGrid cols={1}>
                {[...links].map((item, i) => {
                    let id = item.name.split("Machiko")[1]
                    if (!showNotInstalled || (showNotInstalled && !installed.includes(`tg_${id}`))) {
                        return (
                            <div key={id} className="link-card-mobile">
                                <Accordion
                                    value={activeTab}
                                    onChange={setActiveTab}
                                    variant="separated">
                                    <LinkCardMobile
                                        size={links.length}
                                        data={item}
                                        key={`tg_mobi_${id}`}
                                        id={`tg_${id}`}
                                        idHeader={`tg_`}
                                        showNotInstalled={showNotInstalled}
                                        installed={installed.includes(`tg_${id}`)}
                                        setDownloaded={setDownloaded}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab} />
                                </Accordion>
                            </div>
                        )
                    }
                })}
            </SimpleGrid>


            <Modal
                centered
                className='center'
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title="說明(早前已安裝的用戶)"
            >
                由於原有使用的 <a href="https://whatsticker.online" target="_blank">Whatsticker</a>
                安裝貼圖時太多廣告，現已轉為另一較少廣告平台 <a href="https://getstickerpack.com" target="_blank">Sticker Maker</a>
                <br /><br />
                貼圖由以往動態靜態分開，變成可以混合於同一貼圖包內。建議早前已安裝的用戶將貼圖包全數刪除後重新安裝。
                <br /><br />
            </Modal>

        </>
    )
}