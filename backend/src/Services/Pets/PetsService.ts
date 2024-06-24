import { inject, injectable } from "inversify";
import { DbContextSymbol, IDbContext } from "../../Persistence/IDbContext";
import { BlockchainServiceSymbol, IBlockchainService } from "../Blockchain/IBlockchainService";
import { IPetsService } from "./IPetsService";
import { NotFoundException } from "../../Infrastructure/Exceptions/NotFoundException";
import { BadRequestException } from "../../Infrastructure/Exceptions/BadRequestException";
import { Pet } from "../../Persistence/Entities/Pet";
import { ExperienceUtil } from "../Utils/ExperienceUtil";

@injectable()
export class PetsService implements IPetsService {
  private readonly _dbContext: IDbContext;
  private readonly _blockchainService: IBlockchainService;

  constructor(
    @inject(DbContextSymbol) private dbContext: IDbContext,
    @inject(BlockchainServiceSymbol) private blockchainService: IBlockchainService,
  ) {
    this._dbContext = dbContext;
    this._blockchainService = blockchainService;
  }

  public async AddPet(userId: number, tokenId: number): Promise<void> {
    const user = await this._dbContext.Users.findOne({ Id: userId }, { populate: [ "Pet" ]});
    if (user == null) {
      throw new NotFoundException(`User was not found`);
    }

    if (user.Pet != null) {
      throw new BadRequestException("User already owns the pet");
    }

    const ownerOfPet = await this._blockchainService.OwnerOf(process.env.TAMAVERSE_CONTRACT_ADDRESS, tokenId);
    if (ownerOfPet == null || ownerOfPet != user.WalletAddress) {
      throw new NotFoundException("Pet with this Id does not exist or does not belong to this user")
    }

    const pet = new Pet(tokenId, user);
    await this._dbContext.Pets.persistAndFlush(pet);
  }

  public async AddExperience(userId: number, amount: number): Promise<void> {
    const user = await this._dbContext.Users.findOne({ Id: userId }, { populate: [ "Pet" ]});
    if (user == null) {
      throw new NotFoundException(`User was not found`);
    }

    if (user.Pet == null) {
      throw new BadRequestException("User doesn't own the pet");
    }

    if (user.Eneregy < amount) {
      throw new BadRequestException("Not enough energy");
    }

    user.Eneregy -= amount;
    user.Experience += amount;

    await this._dbContext.Users.flush();
  }

  public async LevelUp(userId: number): Promise<void> {
    const user = await this._dbContext.Users.findOne({ Id: userId }, { populate: [ "Pet" ]});
    if (user == null) {
      throw new NotFoundException(`User was not found`);
    }

    if (user.Pet == null) {
      throw new BadRequestException("User doesn't own the pet");
    }

    const xpRequired = ExperienceUtil.RequiredForLevelUp(user.Level);

    if (user.Experience < xpRequired) {
      throw new BadRequestException("Not enough experience");
    }

    user.Experience -= xpRequired;
    user.Level += 1;

    await this._dbContext.Users.flush();
  }
}
