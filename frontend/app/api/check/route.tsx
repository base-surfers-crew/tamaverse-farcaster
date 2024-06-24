import { BASE_URL, rulesFrameData } from "@/pages/lib/constant";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/core";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import sharp from 'sharp';
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

  const svg = await satori(
    <div style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: 'f4f4f4',
        padding: 50,
        lineHeight: 1.2,
        fontSize: 24,
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
        }}>
            <h2 style={{textAlign: 'center', color: 'lightgray'}}>test</h2>
        </div>
    </div>
    ,
    {
        width: 600, height: 400, 
        fonts: [{
            data: fontData,
            name: 'Roboto',
            style: 'normal',
            weight: 400
        }]
    })

  const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

  const base64Image = pngBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

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
