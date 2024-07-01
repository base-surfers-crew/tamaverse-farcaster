import { errorHandler } from "@/handlers/error-handler";
import { BASE_URL } from "@/lib/constant";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/core";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const frameRequest: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(frameRequest);

  if (!isValid) {
    const errorMeta = await errorHandler();
    return new NextResponse(getFrameHtmlResponse(errorMeta));
  }

  const buttonIndex = message.button;

  let frameImage = "";
  switch (buttonIndex) {
    case 1:
      frameImage = `${BASE_URL}/images/gifs/mine.gif`;
      break;
    case 2:
      frameImage = `${BASE_URL}/images/gifs/gym.gif`;
      break;
    case 3:
      frameImage = `${BASE_URL}/images/gifs/learn.gif`;
    default:
      frameImage = `${BASE_URL}/images/rules/screen.png`;
      break;
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [{ label: "Back to pet screen ⬅️" }],
      postUrl: `${BASE_URL}/api/pet`,
      image: { src: frameImage },
    })
  );
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
