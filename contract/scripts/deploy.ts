import { ethers } from "hardhat";

async function main() {
  const NFT = await ethers.getContractFactory("PetNFT");
  const nft = await NFT.deploy()

  await nft.deployed();

  console.log('PetNft deployed: ', nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
