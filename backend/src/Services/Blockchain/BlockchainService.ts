import { inject, injectable } from "inversify";
import { IBlockchainService } from "./IBlockchainService";
import Contract from "web3-eth-contract";
import { SignaturePacket } from "../../Infrastructure/DTOs/Farcaster/SignaturePacket";
import axios, { Axios } from "axios";
import { ValidateMessageResult } from "../../Infrastructure/DTOs/Farcaster/ValidateMessageResult";
import { BadRequestException } from "../../Infrastructure/Exceptions/BadRequestException";
import { DbContextSymbol, IDbContext } from "../../Persistence/IDbContext";
import { User } from "../../Persistence/Entities/User";
import { TransactionBroadcastDescription } from "../../Infrastructure/DTOs/Farcaster/TransactionBroadcastDescription";

@injectable()
export class BlockchainService implements IBlockchainService {
  private readonly _httpService: Axios;
  private readonly _dbContext: IDbContext;

  constructor(
    @inject(DbContextSymbol) private dbContext: IDbContext,
  ) {
    this._httpService = axios.create();
    this._dbContext = dbContext;
  }

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
      { provider: process.env.BASE_RPC_NODE }
    )

    const owner = await contract.methods.ownerOf(tokenId).call<string>();
    return owner;
  }

  public async Mint(signaturePacket: SignaturePacket): Promise<TransactionBroadcastDescription> {
    console.log("SIGNATURE PACKET");
    console.log(JSON.stringify(signaturePacket));

    const validationResult = await this.ValidateSignaturePacket(signaturePacket);
    if (!validationResult.valid) {
      throw new BadRequestException("Invalid signature packet was provided");
    }

    // Add user if not exists
    let user = await this._dbContext.Users.findOne({ FarcasterId: validationResult.message.data.fid });
    if (user == null) {
      user = new User(validationResult.message.data.fid, validationResult.message.signer);
      await this._dbContext.Users.persistAndFlush(user);
    }

    const minRandom = 10;
    const maxRandom = 99;
    const rarity = Math.floor(Math.random() * (minRandom - maxRandom + 1) + minRandom);

    return {
      // Base Sepolia	
      chainId: "eip155:84532",
      method: "eth_sendTransaction",
      params: {
        abi: [{"inputs":[{"internalType":"uint256","name":"random","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"}],
        to: process.env.TAMAVERSE_CONTRACT_ADDRESS,
        data: `0xa0712d68000000000000000000000000000000000000000000000000000000000000000${rarity}`,
        value: "600000000000000"
      }
    }
  }

  private async ValidateSignaturePacket(signaturePacket: SignaturePacket): Promise<ValidateMessageResult> {
    try { 
      const { data } = await axios.request<ValidateMessageResult>({
        method: "POST",
        url: `${process.env.FARCAST_HTTP_NODE}/v1/validateMessage`,
        data: Buffer.from(signaturePacket.trustedData.messageBytes),
        headers: { "Content-Type": "application/octet-stream" }
      })
      
      return data;
    } catch(e) {
      console.log(e)

      const res = new ValidateMessageResult()
      res.valid = false;

      return res;
    }
  }
}
