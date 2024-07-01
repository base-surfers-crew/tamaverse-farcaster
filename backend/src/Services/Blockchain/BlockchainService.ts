import { inject, injectable } from "inversify";
import { IBlockchainService } from "./IBlockchainService";
import Contract from "web3-eth-contract";
import { SignaturePacket } from "../../Infrastructure/DTOs/Farcaster/SignaturePacket";
import axios, { Axios, AxiosError } from "axios";
import { ValidateMessageResult } from "../../Infrastructure/DTOs/Farcaster/ValidateMessageResult";
import { BadRequestException } from "../../Infrastructure/Exceptions/BadRequestException";
import { DbContextSymbol, IDbContext } from "../../Persistence/IDbContext";
import { User } from "../../Persistence/Entities/User";
import { TransactionBroadcastDescription } from "../../Infrastructure/DTOs/Farcaster/TransactionBroadcastDescription";
import { BinaryUtils } from "../Utils/BinaryUtils";
import { MathUtils } from "../Utils/MathUtils";
import { ILoggerService, LoggerServiceSymbol } from "../Logging/ILoggerService";
import { principal } from "inversify-express-utils";

@injectable()
export class BlockchainService implements IBlockchainService {
  private readonly _httpService: Axios;
  private readonly _dbContext: IDbContext;
  private readonly _logger: ILoggerService;

  constructor(
    @inject(DbContextSymbol) private dbContext: IDbContext,
    @inject(LoggerServiceSymbol) private logger: ILoggerService,
  ) {
    this._httpService = axios.create();
    this._dbContext = dbContext;
    this._logger = logger;
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
    const validationResult = await this.ValidateSignaturePacket(signaturePacket);
    if (!validationResult.valid) {
      throw new BadRequestException("Invalid signature packet was provided");
    }

    // Add user if not exists
    let user = await this._dbContext.Users.findOne({ FarcasterId: validationResult.message.data.fid });
    if (user == null) {
      user = new User(validationResult.message.data.fid, validationResult.message.data.frameActionBody.address);
      await this._dbContext.Users.persistAndFlush(user);
    }

    if (user.PetId != null) {
      throw new BadRequestException("NFT was already minted for this account");
    }

    const minRandom = 10;
    const maxRandom = 99;
    const rarity = MathUtils.GetRandomInt(minRandom, maxRandom);

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
      const { data } = await this._httpService.request<ValidateMessageResult>({
        method: "POST",
        url: `${process.env.FARCAST_HTTP_NODE}/v1/validateMessage`,
        data: BinaryUtils.HexStringToUint8Array(signaturePacket.messageBytes),
        headers: { "Content-Type": "application/octet-stream" }
      })
      
      return data;
    } catch(e) {
      if (e instanceof AxiosError) {
        this._logger.Warn("Got an error, while validating mint message. Data: " + JSON.stringify(e.response.data));
      }
      const res = new ValidateMessageResult()
      res.valid = false;

      return res;
    }
  }
}
