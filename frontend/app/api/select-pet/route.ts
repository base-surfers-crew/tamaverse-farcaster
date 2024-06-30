import { errorHandler } from '@/handlers/error-handler';
import { rulesFrameData, selectDroidFrameData } from '@/lib/constant';
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit/core';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> { 
  const frameRequest: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(frameRequest); 

  if(!isValid){
    const errorMeta = await errorHandler()
    return new NextResponse(getFrameHtmlResponse(errorMeta));
  }

  const frameData = message.button === 1 ? rulesFrameData : selectDroidFrameData

  return new NextResponse(getFrameHtmlResponse(frameData));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
