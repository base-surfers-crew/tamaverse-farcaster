import { FrameMetadataType } from "@coinbase/onchainkit/core";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.tamaverse.live';

export const welcomeFrameData: FrameMetadataType = {
  buttons: [{ label: "Let’s start! 🚀" }],
  postUrl: `${BASE_URL}/api/check`,
  image: `${BASE_URL}/images/welcome/screen.png`,
};

export const activitiesFrameData: FrameMetadataType = {
  buttons: [{ label: "Back" }, { label: "Continue ➡️" }],
  postUrl: `${BASE_URL}/api/pets-list`,
  image: `${BASE_URL}/images/activities/screen.png`,
};

export const petsListFrameData: FrameMetadataType = {
  buttons: [{ label: "Back" }, { label: "Droid 🤖" }],
  postUrl: `${BASE_URL}/api/select-pet`,
  image: `${BASE_URL}/images/pets/list.png`,
};

export const mintPetFrameData: FrameMetadataType = {
  buttons: [
    { label: "Back"}, 
    { 
      label: "Mint! 💠", 
      // action: 'tx', 
      // target: `${BASE_URL}/api/get-tx-data`,
      // postUrl: `${BASE_URL}/api/pet`
     }],
  postUrl: `${BASE_URL}/api/pet`,
  image: {
    src: `${BASE_URL}/images/gifs/hello.gif`,
  },
};

export const createPetFrameData: FrameMetadataType = {
  buttons: [{ label: "Continue" }],
  postUrl: `${BASE_URL}/api/pet`,
  image: {
    src: `${BASE_URL}/images/pets/new-droid.png`,
  },
};

export const rulesFrameData: FrameMetadataType = {
  buttons: [{ label: "Back" }],
  postUrl: `${BASE_URL}/api/pet`,
  image: `${BASE_URL}/images/rules/screen.png`,
};
