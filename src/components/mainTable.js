import { useState } from 'react';
import { Accordion, Grid } from '@mantine/core';
import { IconBrandWhatsapp, IconBrandTelegram, IconMessageCircle2 } from '@tabler/icons';

import Introduction from './introduction';

export default function MainTable() {

    return (
        <div className="main center" >

            <h2>最新最齊 ㄇㄚˊ幾兔 Machiko 貼圖 Sticker 動態 Animated</h2>

            <Introduction />

            <hr />

            總計超過750款Sticker! <br />
            所有<u>動態</u>及<u>靜態</u>貼圖現已合拼於同一貼圖包內 <br/><br/>

            <Accordion variant="separated" >
                <Accordion.Item value="whatsapp">
                    <Accordion.Control className="center">
                        <IconBrandWhatsapp className='space' color='green' size={20} />
                        WhatsApp
                    </Accordion.Control>

                    <Accordion.Panel>Colors, fonts, shadows and many other parts are customizable to fit your design needs</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="signal">
                    <Accordion.Control className="center" >
                        <IconMessageCircle2 className='space' color='blue' size={20} />
                        Signal
                    </Accordion.Control>
                    <Accordion.Panel>Configure components appearance and behavior with vast amount of settings or overwrite any part of component styles</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="telegram">
                    <Accordion.Control className="center">
                        <IconBrandTelegram className='space' color='blue' size={20} />
                        Telegram
                    </Accordion.Control>
                    <Accordion.Panel>With new :focus-visible pseudo-class focus ring appears only when user navigates with keyboard</Accordion.Panel>
                </Accordion.Item>
            </Accordion>


            {/* <Grid>
                <Grid.Col md={6} lg={3}>1</Grid.Col>
                <Grid.Col md={6} lg={3}>2</Grid.Col>
                <Grid.Col md={6} lg={3}>3</Grid.Col>
                <Grid.Col md={6} lg={3}>4</Grid.Col>
            </Grid> */}




        </div>
    );
}
