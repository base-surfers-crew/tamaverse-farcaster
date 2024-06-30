
import { petsListFrameData, welcomeFrameData } from '@/lib/constant';
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit/core';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const frameRequest: FrameRequest = await req.json();

  // const { isValid, message } = await getFrameMessage(frameRequest, { allowFramegear }); 

  const buttonIndex = frameRequest.untrustedData.buttonIndex

  const frameData = buttonIndex === 1 ? welcomeFrameData : petsListFrameData


  return new NextResponse(
    getFrameHtmlResponse(frameData),
);
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}