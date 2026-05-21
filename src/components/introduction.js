import { useState } from 'react';
import { IconBrandFacebook, IconArrowsShuffle, IconBrandInstagram } from '@tabler/icons';
import { Grid, Button, Image } from '@mantine/core';

import RandomPhotoURL from '../data/randomPhoto.json'


export default function Introduction() {
    const crypto = window.crypto || window.msCrypto;
    let array = new Uint32Array(1);
    crypto.getRandomValues(array); // Compliant for security-sensitive use cases
    
    const [randomNumber, setRandomNumber] = useState(array[0] % 9)
    

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
                        onClick={() => { crypto.getRandomValues(array); setRandomNumber(array[0] % 9);}}
                        leftIcon={<IconArrowsShuffle size={20} />} >
                        Random
                    </Button>
                </Grid.Col>
                
                <Grid.Col span={1} >
                    <h2>Machiko ㄇㄚˊ幾兔</h2>
                    <h2></h2>

                    請支持原作者！ <br />
                    <a target="_blank" href="https://www.facebook.com/machiko324" rel="noopener">
                        <Button leftIcon={<IconBrandFacebook />}>原作者Facebook: Yukiji</Button>
                    </a>
                    <div className="intro-button" />
                    <a target="_blank" href="https://instagram.com/machiko324" rel="noopener">
                        <Button className='ig' leftIcon={<IconBrandInstagram />}>原作者Instagram</Button>
                    </a><br/><br/> 
                    {/* <div className="intro-button" />
                    <a target="_blank" href="https://www.facebook.com/groups/1142468716358996" rel="noopener">
                        <Button leftIcon={<IconUsers />}>香港非官方Fans Club</Button>
                    </a> */}

                </Grid.Col>

            </Grid>

        </>
    )
}


// margin-left: auto;
// margin-right: auto;
// width: 50%;
