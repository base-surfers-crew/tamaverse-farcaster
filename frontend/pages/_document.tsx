
import { welcomeImageBase64 } from '@/lib/base-64-images.constant'
import { BASE_URL } from '@/lib/constant'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="fc:frame" content="vNext" />
        <meta property="og:title" content="Tamaverse" />
        <meta property="fc:frame:image" content={welcomeImageBase64} />
        <meta property="og:image" content={welcomeImageBase64} />
        <meta property="fc:frame:post_url" content={`${BASE_URL}/api/check`} />
        <meta property="fc:frame:button:1" content="Let’s start! 🚀" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
