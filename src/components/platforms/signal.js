import { useState, useEffect } from 'react';
import { Modal, Button, SimpleGrid, Group, Accordion } from '@mantine/core';
import { IconArrowsDownUp, IconInfoCircle, IconEyeOff, IconEye } from '@tabler/icons'

import SignalLink_ from '../../data/signal.json'
import LinkCard from './card';
import LinkCardMobile from './cardMobile';


export default function Signal(props) {
    let installed = props.installed
    let setInstalled = props.setInstalled
    let setNeedUpdate = props.setNeedUpdate

    const [modalOpen, setModalOpen] = useState(false)
    const [links, setLinks] = useState(SignalLink_)
    const [reverseOrder, setReverseOrder] = useState(false)
    const [activeTab, setActiveTab] = useState("")
    const [showNotInstalled, setShowNotInstalled] = useState(false)

    const setDownloaded = (id) => {
        let tmp_installed = installed
        console.log(tmp_installed)
        tmp_installed.push(id)
        setInstalled(tmp_installed)
        setNeedUpdate(true)
    }


    return (
        <>
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
            <hr />

            <SimpleGrid cols={4}>
                {[...links].map((item, i) => {
                    let id = item.name.split("Machiko")[1]
                    if (!showNotInstalled || (showNotInstalled && !installed.includes(`signal_${id}`))) {
                        return (
                            <div key={i} className="link-card-desktop">
                                <LinkCard
                                    data={item}
                                    key={`signal_${id}`}
                                    id={`signal_${id}`}
                                    idHeader={`signal_`}
                                    installed={installed.includes(`signal_${id}`)}
                                    setDownloaded={setDownloaded} />
                            </div>
                        )

                    }
                })}
            </SimpleGrid>
            <SimpleGrid cols={1}>
                {[...links].map((item, i) => {
                    let id = item.name.split("Machiko")[1]
                    if (!showNotInstalled || (showNotInstalled && !installed.includes(`signal_${id}`))) {
                        return (
                            <div key={i} className="link-card-mobile">
                                <Accordion
                                    value={activeTab}
                                    onChange={setActiveTab}
                                    variant="separated">
                                    <LinkCardMobile
                                        size={links.length}
                                        data={item}
                                        key={`signal_mobi_${id}`}
                                        id={`signal_${id}`}
                                        idHeader={`signal_`}
                                        showNotInstalled={showNotInstalled}
                                        installed={installed.includes(`signal_${id}`)}
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