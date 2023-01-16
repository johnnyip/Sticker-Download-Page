import { useState } from 'react';
import { IconBrandFacebook, IconArrowsShuffle, IconUsers, IconBrandInstagram } from '@tabler/icons';
import { Grid, Button, Image } from '@mantine/core';

import RandomPhotoURL from '../data/randomPhoto.json'


export default function Introduction() {

    const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * RandomPhotoURL.length))
    console.log(RandomPhotoURL)
    return (
        <>
            <Grid grow >
                <Grid.Col span={2} >
                    <Image
                        height={200}
                        fit="contain"
                        src={RandomPhotoURL[randomNumber].url} /><br />

                    <Button
                        color="gray"
                        onClick={() => { setRandomNumber(Math.floor(Math.random() * RandomPhotoURL.length)) }}
                        leftIcon={<IconArrowsShuffle size={20} />} >
                        Random
                    </Button>
                </Grid.Col>

                <Grid.Col span={1} >
                    <h2>Machiko</h2>
                    <h2>ㄇㄚˊ幾兔</h2>

                    請支持原作者！ <br />
                    <a target="_blank" href="https://www.facebook.com/machiko324" rel="noopener">
                        <Button leftIcon={<IconBrandFacebook />}>原作者Facebook: Yukiji</Button>
                    </a>
                    <div className="intro-button" />
                    <a target="_blank" href="https://instagram.com/machiko324" rel="noopener">
                        <Button className='ig' leftIcon={<IconBrandInstagram />}>原作者Instagram</Button>
                    </a>
                    <div className="intro-button" />
                    <a target="_blank" href="https://www.facebook.com/groups/1142468716358996" rel="noopener">
                        <Button leftIcon={<IconUsers />}>香港非官方Fans Club</Button>
                    </a>

                </Grid.Col>

            </Grid>

        </>
    )
}


// margin-left: auto;
// margin-right: auto;
// width: 50%;
