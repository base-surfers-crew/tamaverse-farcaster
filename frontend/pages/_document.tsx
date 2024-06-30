import { BASE_URL } from '@/lib/constant'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <meta property="fc:frame" content="vNext" />
        <meta property="og:title" content="Tamaverse" />
        <meta property="fc:frame:image" content={`${BASE_URL}/images/welcome/screen.png` } />
        <meta property="og:image" content={`${BASE_URL}/images/welcome/screen.png`} />
        <meta property="fc:frame:post_url" content={`${BASE_URL}/api/check`} />
        <meta property="fc:frame:button:1" content="Let’s start! 🚀" /> */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://get.pxhere.com/photo/sea-water-ocean-wave-underwater-biology-lagoon-coral-reef-reef-snorkeling-florida-keys-shoal-wind-wave-marine-biology-looe-key-1390347.jpg" />
        <meta property="fc:frame:button:1" content="Green" />
        <meta property="fc:frame:button:2" content="Purple" />
        <meta property="fc:frame:button:3" content="Red" />
        <meta property="fc:frame:button:4" content="Blue" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
