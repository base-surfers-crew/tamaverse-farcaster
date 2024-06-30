import { errorHandler } from '@/handlers/error-handler';
import { BASE_URL, petsListFrameData } from '@/lib/constant';
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit/core';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const frameRequest: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(frameRequest); 
  
  if(!isValid){
    const errorMeta = await errorHandler()
    return new NextResponse(getFrameHtmlResponse(errorMeta));
  }

  try {
    if(message.button === 1) return new NextResponse(getFrameHtmlResponse(petsListFrameData))

    const mintResponse = await fetch(`${BASE_URL}/backend/pets/mint`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(frameRequest.trustedData)
    })

    const mintResponseData = await mintResponse.json();
  
    return new NextResponse(JSON.stringify(mintResponseData.data), { status: 200 });
  } catch {
    const errorMeta = await errorHandler('Error on mint NFT')
    return new NextResponse(getFrameHtmlResponse(errorMeta));
  }
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
