import { FrameMetadataType, getFrameHtmlResponse } from "@coinbase/onchainkit/core";

export function getFrameHtml(frameMetadata: FrameMetadataType) {
    const html = getFrameHtmlResponse(frameMetadata);
  
    const extraTags = [
      '<meta property="og:title" content="Farcaster: Horse">',
      '<meta property="og:description" content="Farcaster Protocol Release">',
      '<meta property="og:image" content="https://mint.farcaster.xyz/api/images/start">',
    ];
    
    return `${html.slice(0, html.length - 14)}${extraTags.join('')}</head></html>`;
  }