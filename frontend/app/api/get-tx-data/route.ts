import { createPetFrameData } from '@/lib/constant';
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit/core';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const allowFramegear = process.env.NODE_ENV !== 'production'; 
  const frameRequest: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(frameRequest, { allowFramegear }); 

  const buttonIndex = frameRequest.untrustedData.buttonIndex

  console.log(message)

  const frameData = createPetFrameData

// Отправляем запрос на бекенд, получаем транзакцию и возвращаем ее, чтобы передать в callback

  const txPayload = {
    chainId: "eip155:10",
    method: "eth_sendTransaction",
    params: {
      abi: [
        {
            "constant": false,
            "inputs": [
              {
                "name": "_to",
                "type": "address"
              },
              {
                "name": "_value",
                "type": "uint256"
              }
            ],
            "name": "mint",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          }
      ],
      to: "0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D",
      data: "0x783a112b0000000000000000000000000000000000000000000000000000000000000e250000000000000000000000000000000000000000000000000000000000000001",
      value: "984316556204476",
    },
  };

  return new NextResponse(JSON.stringify(txPayload), {status: 200 });
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}