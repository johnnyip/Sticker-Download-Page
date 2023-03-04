import { useState, useEffect } from 'react';
import { Modal, Button, SimpleGrid, Group, Accordion } from '@mantine/core';
import { IconArrowsDownUp, IconInfoCircle, IconEyeOff, IconEye } from '@tabler/icons'

import WhatsappLink_ from '../../data/whatsapp.json'
import LinkCard from './card';
import LinkCardMobile from './cardMobile';

export default function Whatsapp(props) {
    let installed = props.installed
    let setInstalled = props.setInstalled
    let setNeedUpdate = props.setNeedUpdate

    const [modalOpen, setModalOpen] = useState(false)
    const [links, setLinks] = useState(WhatsappLink_)
    const [reverseOrder, setReverseOrder] = useState(false)
    const [activeTab, setActiveTab] = useState("")
    const [showNotInstalled, setShowNotInstalled] = useState(false)

    const setDownloaded = (id) => {
        let tmp_installed = installed
        // if (!tmp_installed.includes(id)) {
            tmp_installed.push(id)
            setInstalled(tmp_installed)
            setNeedUpdate(true)
        // }
        console.log(tmp_installed)
    }

    return (
        <>
            <hr />
            <Button leftIcon={<IconInfoCircle />} onClick={() => { setModalOpen(true) }}>
                說明(早前已安裝的用戶)及常見問題
            </Button><br /><br />
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
            <hr />

            <SimpleGrid cols={4}>
                {[...links].map((item, i) => {
                    let id = item.name.split("Machiko")[1]
                    if (!showNotInstalled || (showNotInstalled && !installed.includes(`what_${id}`))) {
                        return (
                            <div key={i} className="link-card-desktop">
                                <LinkCard
                                    data={item}
                                    key={`what_${id}`}
                                    id={`what_${id}`}
                                    idHeader={`what_`}
                                    installed={installed.includes(`what_${id}`)}
                                    setDownloaded={setDownloaded} />
                            </div>
                        )

                    }
                })}
            </SimpleGrid>
            <SimpleGrid cols={1}>
                {[...links].map((item, i) => {
                    let id = item.name.split("Machiko")[1]
                    if (!showNotInstalled || (showNotInstalled && !installed.includes(`what_${id}`))) {
                        return (
                            <div key={i} className="link-card-mobile">
                                <Accordion
                                    value={activeTab}
                                    onChange={setActiveTab}
                                    variant="separated">
                                    <LinkCardMobile
                                        size={links.length}
                                        data={item}
                                        key={`what_mobi_${id}`}
                                        id={`what_${id}`}
                                        idHeader={`what_`}
                                        showNotInstalled={showNotInstalled}
                                        installed={installed.includes(`what_${id}`)}
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
                title="說明(早前已安裝的用戶)及常見問題"
            >
                由於原有使用的 <a href="https://whatsticker.online" target="_blank"><u>Whatsticker</u></a>
                安裝貼圖時太多廣告，現已轉為另一較少廣告平台 <a href="https://getstickerpack.com" target="_blank"><u>Sticker Maker</u></a>
                <br /><br />
                貼圖由以往動態靜態分開，變成可以混合於同一貼圖包內。建議早前已安裝的用戶將貼圖包全數刪除後重新安裝。
                <br /><br />

                <hr />
                <b>iOS用家無法打開App下載頁</b><br /><br />

                如於下載頁面按下[Install Sticker]後，即使已安裝程式亦出現左邊畫面，可依照下圖指示修復問題。<br />
                <img src="https://johnnyip.com/wp-content/uploads/2023/01/fix_1.png" width={"50%"} />
                <img src="https://johnnyip.com/wp-content/uploads/2023/01/fix_2.png" width={"50%"} />
            </Modal>

        </>
    )
}