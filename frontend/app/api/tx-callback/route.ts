import { errorHandler } from '@/handlers/error-handler';
import { BASE_URL, petsListFrameData, welcomeFrameData } from '@/lib/constant';
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit/core';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
    return new NextResponse(getFrameHtmlResponse(welcomeFrameData));
}

export function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
