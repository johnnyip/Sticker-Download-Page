import { useState } from 'react';
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { IconFileDownload } from '@tabler/icons'


export default function LinkCard(props) {
    let data = props.data
    let id = props.id
    let installed = props.installed
    let setDownloaded = props.setDownloaded

    return (
        <div className="link-card-desktop">
            <Card shadow="sm" p="xs" radius="md" withBorder
                style={{ backgroundColor: (installed ? '#CDFFC4' : "") }}>
                <Card.Section >
                    <div >
                        <img
                            className='center'
                            src={data.thumbnail}
                            height={160}
                            alt={data.name}
                        />
                    </div>
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                    <Text weight={500}>{data.name}</Text>
                    {(data.new === true) ?
                        <Badge color="pink" variant="light" radius="xs">New</Badge> : <></>}

                </Group>

                <Text size="sm" color="dimmed">
                    {data.category}
                </Text>

                {(data.url2 === "") ?
                    <>
                        <a href={data.url} target="_blank" style={{ textDecorationLine: "none" }}>
                            <Button variant="light" color="blue" fullWidth mt="md" radius="md"
                                onClick={() => {
                                    setDownloaded(id)
                                }}>
                                下載
                            </Button>
                        </a>
                    </> : <>
                        {/* For Whatsapp */}
                        <a href={data.url} target="_blank" style={{ textDecorationLine: "none" }}>
                            <Button variant="light" color="blue" fullWidth mt="md" radius="md"
                                onClick={() => {
                                    setDownloaded(id)
                                }}>
                                下載(Sticker Maker, {(data.animated) ? "動+靜態" : "靜態"})
                            </Button>
                        </a>
                        <a href={data.url2} target="_blank" style={{ textDecorationLine: "none" }}>
                            <Button variant="light" color="gray" fullWidth mt="md" radius="md"
                                onClick={() => {
                                    setDownloaded(id)
                                }}>
                                後備下載(Whatsticker, 靜態)
                            </Button>
                        </a>
                    </>}
            </Card>
        </div>
    )
}