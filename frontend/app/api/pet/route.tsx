import { BASE_URL } from "@/lib/constant";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import { join } from 'path';
import * as fs from "fs";
import sharp from 'sharp';
import { errorHandler } from "@/handlers/error-handler";

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
const fontData = fs.readFileSync(fontPath)

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const frameRequest: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(frameRequest); 

  if(!isValid){
    const errorMeta = await errorHandler('Error on get data about pet')
    return new NextResponse(getFrameHtmlResponse(errorMeta));
  }

  const absoluteImageUrl = `${BASE_URL}/images/pets/droid.png`;
  const userFid = message?.interactor?.fid || '';

  const svg = await satori(
    <div style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        paddingTop: 24,
        paddingBottom: 32,
        paddingLeft: 12,
        paddingRight: 12,
        lineHeight: 1.2,
        fontSize: 24,
        color: '#fff',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: 60,
      }}>
        <div style={{
          marginBottom: 8
        }}>75%</div>
        <div 
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          width: '100%',
          height: '100%',
          backgroundColor: '#424242',
          borderRadius: 6,
          border: '2px solid #333333',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%',
            height: '75%',
            backgroundColor: '#06D75A',
          }}>
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%',
      }}>
        <div style={{
            marginBottom: 8
        }}>Droid {userFid}</div>
        <img style={{
          display: 'block',
          width: '50%',
          height: '100%',
          objectFit: 'contain',
        }} src={absoluteImageUrl} />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        width: 60,
      }}>
        <div style={{
          marginBottom: 8
        }}>Lvl 1</div>
        <div 
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          width: '100%',
          height: '100%',
          backgroundColor: '#424242',
          borderRadius: 6,
          border: '2px solid #333333',
          overflow: 'hidden',
        }}>
           <div style={{
            width: '100%',
            height: '15%',
            backgroundColor: '#25AAE3',
          }}></div>
        </div>
      </div>

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

  const svgBuffer = Buffer.from(svg);
  const pngBuffer = await sharp(svgBuffer).png().toBuffer();
  const base64Png = pngBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Png}`;

  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      { label: "Mine ⛏️" },
      { label: "Train 💪" },
      { label: "Educate 🧠" },
      { label: "Rules" },
    ],
    postUrl: `${BASE_URL}/api/pet-actions`,
    image: { src: dataUrl },
  }));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
