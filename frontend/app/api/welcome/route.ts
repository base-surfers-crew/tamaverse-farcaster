import { welcomeFrameData } from "@/lib/constant";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest) {
  const allowFramegear = process.env.NODE_ENV !== "production";
  const frameRequest: FrameRequest = await req.json();

  // const {isValid, message} = await getFrameMessage(frameRequest, {
  //   allowFramegear,
  // });

  return new NextResponse(getFrameHtmlResponse(welcomeFrameData));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
