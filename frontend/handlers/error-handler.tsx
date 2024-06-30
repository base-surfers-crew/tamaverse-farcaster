import { join } from 'path';
import * as fs from "fs";
import { FrameMetadataType } from '@coinbase/onchainkit/core';
import satori from 'satori';
import { BASE_URL } from '@/lib/constant';

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
const fontData = fs.readFileSync(fontPath)

export const errorHandler =  async (errorMessage?: string): Promise<FrameMetadataType> => {

    const svg = await satori(
      <div style={{
            display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          paddingTop: 24,
          paddingBottom: 32,
          paddingLeft: 12,
          paddingRight: 12,
          lineHeight: 1.2,
          fontSize: 40,
          color: '#fff',
      }}>
        <div>{errorMessage ?? 'Unexpected error'}</div>
      </div>
      ,
      {
          width: 668, height: 350, 
          fonts: [{
              data: fontData,
              name: 'Roboto',
              style: 'normal',
              weight: 400
          }]
      })
  
    const base64Svg = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

    return {
        buttons: [
          {label: "Back to main page"},
        ],
        postUrl: `${BASE_URL}/api/welcome`,
        image: {src: dataUrl},
    }
}