import { injectable } from "inversify";
import { IBlockchainService } from "./IBlockchainService";
import Contract from "web3-eth-contract";

@injectable()
export class BlockchainService implements IBlockchainService {
  public async OwnerOf(contractAddress: string, tokenId: number): Promise<string | null> {
    const ownerOfAbi = [{
      "constant":true,
      "inputs":[{"name":"tokenId","type":"uint256"}],
      "name":"ownerOf",
      "outputs":[{"name":"owner","type":"address"}],
      "type":"function"
    }]

    const contract = new Contract(
      ownerOfAbi,
      contractAddress,
      { provider: process.env.ETH_RPC_NODE }
    )

    const owner = await contract.methods.ownerOf(tokenId).call<string>();
    return owner;
  }
}
