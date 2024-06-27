import { rulesFrameData, walletConnectedFrameData } from '@/lib/constant';
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit/core';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // const allowFramegear = process.env.NODE_ENV !== 'production'; 
  const frameRequest: FrameRequest = await req.json();
  // const { isValid, message } = await getFrameMessage(frameRequest, { allowFramegear }); 

  const buttonIndex = frameRequest.untrustedData.buttonIndex
  let frameData = rulesFrameData
  switch(buttonIndex){
    case 1:
      frameData = rulesFrameData;
      break;
    case 2:
      frameData = walletConnectedFrameData
      break;
    case 3:
      frameData = walletConnectedFrameData
      break;
  }

  return new NextResponse(getFrameHtmlResponse(frameData))
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
