import { rulesFrameData } from "@/lib/constant";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";
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

  return new NextResponse(getFrameHtmlResponse(rulesFrameData));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

// export const dynamic = 'force-dynamic';
