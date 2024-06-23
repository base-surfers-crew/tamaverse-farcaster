import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit/core';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const allowFramegear = process.env.NODE_ENV !== 'production'; 
  const frameRequest: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(frameRequest, { allowFramegear }); 

  console.log(process.env.NODE_ENV,)

  return new NextResponse(
    getFrameHtmlResponse({
        buttons: [
          { label: 'Back', action:'post', target: 'http://localhost:3000/api/welcome-check' },
          { label: 'Connect MetaMask', postUrl: 'http://localhost:3000/api/welcome-check' },
          { label: 'Connect CoinBase Wallet', postUrl: 'http://localhost:3000/api/welcome-check' },
        ],
        postUrl: 'http://localhost:3000/',
        image: `http://localhost:3000/images/connect-wallet/screen.png`,
      }),
    );
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
