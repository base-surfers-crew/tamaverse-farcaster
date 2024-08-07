
import { errorHandler } from '@/handlers/error-handler';
import { rulesFrameData, welcomeFrameData } from '@/lib/constant';
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit/core';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const allowFramegear = process.env.NODE_ENV !== 'production'; 
  const frameRequest: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(frameRequest, { allowFramegear }); 

  if(!isValid){
    const errorMeta = await errorHandler()
    return new NextResponse(getFrameHtmlResponse(errorMeta));
  }


  return new NextResponse(getFrameHtmlResponse(rulesFrameData));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}