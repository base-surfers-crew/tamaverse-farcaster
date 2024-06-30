import { errorHandler } from "@/handlers/error-handler";
import { rulesFrameData } from "@/lib/constant";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest) {
  const frameRequest: FrameRequest = await req.json();

  // const allowFramegear = process.env.NODE_ENV !== 'production'; 
  // const {isValid, message} = await getFrameMessage(frameRequest, {
  //   allowFramegear
  // });


  // console.log(message)

  // if(!isValid){
  //   const errorMeta = await errorHandler()
  //   return new NextResponse(getFrameHtmlResponse(errorMeta));
  // }

  return new NextResponse(getFrameHtmlResponse(rulesFrameData));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
