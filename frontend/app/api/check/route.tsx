import { errorHandler } from "@/handlers/error-handler";
import { activitiesFrameData } from "@/lib/constant";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest) {
  const frameRequest: FrameRequest = await req.json();
  const {isValid, message} = await getFrameMessage(frameRequest);

  if(!isValid){
    const errorMeta = await errorHandler()
    return new NextResponse(getFrameHtmlResponse(errorMeta));
  }

  return new NextResponse(getFrameHtmlResponse(activitiesFrameData));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
