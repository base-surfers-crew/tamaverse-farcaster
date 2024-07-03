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
    // console.log( new NextResponse(JSON.stringify(mintResponseData), { status: 200 }))
    const test = {
      chainId: mintResponseData.chainId,
      method: mintResponseData.method,
      params: {
        abi: mintResponseData.params.abi,
        to: mintResponseData.params.to,
        data: mintResponseData.params.data,
        value: mintResponseData.params.value,
      }
    }
    // const txPayload = {
    //   chainId: "eip155:84532",
    //   method: "eth_sendTransaction",
    //   params: {
    //     abi: [
    //       {
    //           "constant": false,
    //           "inputs": [
    //             {
    //               "name": "_to",
    //               "type": "address"
    //             },
    //             {
    //               "name": "_value",
    //               "type": "uint256"
    //             }
    //           ],
    //           "name": "mint",
    //           "outputs": [],
    //           "payable": false,
    //           "stateMutability": "nonpayable",
    //           "type": "function"
    //         }
    //     ],
    //     to: "0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D",
    //     data: "0x783a112b0000000000000000000000000000000000000000000000000000000000000e250000000000000000000000000000000000000000000000000000000000000001",
    //     value: "984316556204476",
    //   },
    // };
    return new NextResponse(
      JSON.stringify(test), 
      { status: 200, headers: { 'Content-Type': 'application/json' }  });
  } catch {
    const errorMeta = await errorHandler('Error on mint NFT')
    return new NextResponse(getFrameHtmlResponse(errorMeta));
  }
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
