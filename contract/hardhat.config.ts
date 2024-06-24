import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_URL || '',
      accounts: process.env.MUMBAI_PRIVATE_KEY ? [process.env.MUMBAI_PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_URL || '',
      accounts: process.env.POLYGON_PRIVATE_KEY ? [process.env.POLYGON_PRIVATE_KEY] : [],
    },
    base_testnet: {
      url: process.env.BASE_TESTNET_URL || '',
      accounts: process.env.BASE_TESTNET_PRIVATE_KEY ? [process.env.BASE_TESTNET_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
};

export default config;
