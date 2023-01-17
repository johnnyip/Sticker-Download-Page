import { useState } from 'react';
import { Card, Image, Text, Badge, Button, Group, Accordion } from '@mantine/core';


export default function LinkCardMobile(props) {
    let data = props.data
    let id = props.id
    let installed = props.installed
    let setDownloaded = props.setDownloaded
    let currSequence = parseInt(id.split("_")[1])
    let size = props.size

    let activeTab = props.activeTab
    let setActiveTab = props.setActiveTab

    return (
        <Accordion.Item
            value={id}
            style={{ backgroundColor: (installed ? '#CDFFC4' : "") }}>
            <Accordion.Control>
                <div className='center'>
                    {installed ? "✅" : ""}
                    {data.name} ({data.category}){"  "}
                    {/* <Badge color="pink" variant="light" radius="xs">New</Badge> */}

                </div>
            </Accordion.Control>

            <Accordion.Panel>
                <div className="link-card-mobile">
                    <Card shadow="sm" p="xs" radius="md" withBorder >
                        <Card.Section >
                            <Group grow>
                                <a href={`#what_${currSequence - 1}`} style={{ textDecorationLine: "none" }}>

                                    <Button
                                        disabled={(currSequence == 1)}
                                        onClick={() => {
                                            setActiveTab(`what_${currSequence - 1}`)
                                        }}>
                                        上一個貼圖包</Button>
                                </a>
                                <a href={`#what_${currSequence + 1}`} style={{ textDecorationLine: "none" }}>
                                    <Button
                                        disabled={(currSequence == size)}
                                        onClick={() => {
                                            setActiveTab(`what_${currSequence + 1}`)
                                        }}>
                                        下一個貼圖包</Button>
                                </a>
                            </Group>

                            <div >
                                <img
                                    className='center'
                                    src={data.thumbnail}
                                    width={200}
                                    alt={data.name}
                                />
                            </div>
                        </Card.Section>

                        <Group position="apart" mt="md" mb="xs">
                            <Text weight={500}>{data.name}</Text>
                        </Group>

                        <Text size="sm" color="dimmed">
                            {data.category}
                        </Text>

                        <a href={data.url} target="_blank" style={{ textDecorationLine: "none" }}>
                            <Button variant="light" color="blue" fullWidth mt="md" radius="md"
                                onClick={() => {
                                    setDownloaded(id)
                                }}>
                                下載
                            </Button>
                        </a>
                    </Card>
                </div>
            </Accordion.Panel>
        </Accordion.Item>


    )
}