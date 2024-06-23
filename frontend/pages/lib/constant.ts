export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export const welcomeFrameData: FrameMetadataHTMLResponse = {
    buttons: [
      { label: 'Start' },
    ],
    postUrl: `${BASE_URL}/api/check`,
    image: `${BASE_URL}/images/welcome/screen.png`,
}

export const rulesFrameData: FrameMetadataHTMLResponse = {
    buttons: [
      { label: 'Back' },
      { label: 'Start' },
    ],
    postUrl: `${BASE_URL}/api/connect-wallet`,
    image: `${BASE_URL}/images/rules/screen.png`,
  }

export const connectWalletFrameData: FrameMetadataHTMLResponse = {
    buttons: [
      { label: 'Back', action:'post', target: `${BASE_URL}/api/welcome-check` },
      { label: 'Connect MetaMask', postUrl: `${BASE_URL}/api/welcome-check` },
      { label: 'Connect CoinBase Wallet', postUrl: `${BASE_URL}/api/welcome-check` },
    ],
    postUrl: BASE_URL,
    image: `${BASE_URL}/images/connect-wallet/screen.png`,
}