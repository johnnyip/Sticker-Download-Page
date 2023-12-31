import { Card, Text, Badge, Button, Group, Accordion } from '@mantine/core';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons'


export default function LinkCardMobile(props) {
    let data = props.data
    let id = props.id
    let size = props.size
    let installed = props.installed
    let idHeader = props.idHeader
    let setDownloaded = props.setDownloaded
    let showNotInstalled = props.showNotInstalled

    let currSequence = parseInt(id.split("_")[1])

    let setActiveTab = props.setActiveTab

    return (
        <Accordion.Item
            value={id}
            style={{ backgroundColor: (installed ? '#CDFFC4' : "") }}>
            <Accordion.Control>
                <div className='center'>
                    {installed ? "✅" : ""}
                    {data.name} {(data.category !== "") ? `(${data.category})` : ""}{"  "}
                    {(data.new === true) ?
                        <Badge color="pink" variant="light" radius="xs">New</Badge> : <></>}

                </div>
            </Accordion.Control>

            <Accordion.Panel>
                <div className="link-card-mobile">
                    <Card shadow="sm" p="xs" radius="md" withBorder >
                        <Card.Section >
                            <Group grow>

                                <Button
                                    className={showNotInstalled ? "hidden" : ""}
                                    leftIcon={<IconArrowLeft />}
                                    fullWidth
                                    disabled={(currSequence === 1)}
                                    onClick={() => {
                                        setActiveTab(`${idHeader}${currSequence - 1}`)
                                    }}>
                                    上一個</Button>
                                <Button
                                    className={showNotInstalled ? "hidden" : ""}
                                    rightIcon={<IconArrowRight />}
                                    fullWidth
                                    disabled={(currSequence === size)}
                                    onClick={() => {
                                        setActiveTab(`${idHeader}${currSequence + 1}`)
                                    }}>
                                    下一個</Button>
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
            </Accordion.Panel>
        </Accordion.Item>


    )
}