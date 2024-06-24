import { BASE_URL, rulesFrameData } from "@/pages/lib/constant";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/core";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import { join } from 'path';
import * as fs from "fs";

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
const fontData = fs.readFileSync(fontPath)

async function getResponse(req: NextRequest) {
  const allowFramegear = process.env.NODE_ENV !== "production";
  const frameRequest: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(frameRequest, {
    allowFramegear,
  });

  const absoluteImageUrl = `${BASE_URL}/images/pets/test.png`;

  const svg = await satori(
    <div style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        padding: 12,
        lineHeight: 1.2,
        fontSize: 24,
        color: '#fff',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <span>100%</span>
        <div 
        style={{
          width: '100%',
          backgroundColor: '#06D75A',
          height: '100%',
        }}></div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div>Droid_Chepurin</div>
        <img style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }} src={absoluteImageUrl} />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <span>Lvl 1</span>
        <div 
        style={{
          width: '100%',
          backgroundColor: '#06D75A',
          height: '100%',
        }}></div>
      </div>

    </div>
    ,
    {
        width: 675, height: 350, 
        fonts: [{
            data: fontData,
            name: 'Roboto',
            style: 'normal',
            weight: 400
        }]
    })

  const base64Svg = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

  return new NextResponse(getFrameHtmlResponse({
    buttons: [{ label: "Back" }, { label: "Start" }],
    postUrl: `${BASE_URL}/api/why-connect-wallet`,
    image: dataUrl,
  }));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

// export const dynamic = 'force-dynamic';
