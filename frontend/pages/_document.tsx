import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="fc:frame" content="vNext" />
        <meta property="og:title" content="Farcaster: Tamagotchi" />
        <meta property="og:description" content="Farcaster: Tamagotchi game" />
        <meta property="fc:frame:image" content="http://localhost:3000/images/welcome/screen.png" />
        <meta property="og:image" content="http://localhost:3000/images/welcome/screen.png" />
        <meta property="fc:frame:post_url" content={`http://localhost:3000/api/check`} />
        <meta property="fc:frame:button:1" content="Let’s start! 🚀" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
