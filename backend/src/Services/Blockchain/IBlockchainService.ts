import { SignaturePacket } from "../../Infrastructure/DTOs/Farcaster/SignaturePacket";
import { TransactionBroadcastDescription } from "../../Infrastructure/DTOs/Farcaster/TransactionBroadcastDescription";

export interface IBlockchainService {
  OwnerOf(contract: string, tokenId: number): Promise<string | null>;
  Mint(signaturePacket: SignaturePacket): Promise<TransactionBroadcastDescription>;
}

export const BlockchainServiceSymbol = "IBlockchainService";
