export interface IBlockchainService {
  OwnerOf(contract: string, tokenId: number): Promise<string | null>;
}

export const BlockchainServiceSymbol = "IBlockchainService";
