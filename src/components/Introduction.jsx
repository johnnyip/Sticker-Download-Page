import { useState } from 'react';
import { Button, Grid, Image } from '@mantine/core';
import {
  IconArrowsShuffle,
  IconBrandFacebook,
  IconBrandInstagram,
} from '@tabler/icons-react';

import randomPhotoUrls from '../data/randomPhoto.json';

function getRandomPhotoIndex() {
  return Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] % randomPhotoUrls.length);
}

export default function Introduction() {
  const [randomNumber, setRandomNumber] = useState(getRandomPhotoIndex);

  return (
    <Grid grow>
      <Grid.Col span={2}>
        <Image
          height={200}
          fit="contain"
          src={randomPhotoUrls[randomNumber].url}
          alt="Machiko 隨機圖片"
        />
        <br />

        <Button
          color="gray"
          onClick={() => {
            setRandomNumber(getRandomPhotoIndex());
          }}
          leftIcon={<IconArrowsShuffle size={20} />}
        >
          Random
        </Button>
      </Grid.Col>

      <Grid.Col span={1}>
        <h2>Machiko ㄇㄚˊ幾兔</h2>

        請支持原作者！ <br />
        <a target="_blank" href="https://www.facebook.com/machiko324" rel="noreferrer">
          <Button leftIcon={<IconBrandFacebook />}>原作者Facebook: Yukiji</Button>
        </a>
        <div className="intro-button" />
        <a target="_blank" href="https://instagram.com/machiko324" rel="noreferrer">
          <Button className="ig" leftIcon={<IconBrandInstagram />}>
            原作者Instagram
          </Button>
        </a>
        <br />
        <br />
      </Grid.Col>
    </Grid>
  );
}
