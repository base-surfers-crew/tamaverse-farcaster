import { controller, httpPost, httpPut, requestBody } from "inversify-express-utils";
import { Prefix } from "./Prefix";
import { IPetsService, PetsServiceSymbol } from "../Services/Pets/IPetsService";
import { inject } from "inversify";
import { BaseController } from "./BaseController";
import { AddPetRequest } from "../Infrastructure/DTOs/Pets/Requests/AddPetRequest";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../Infrastructure/Exceptions/ValidationException";
import { AddExperienceRequest } from "../Infrastructure/DTOs/Pets/Requests/AddExperienceRequest";

@controller(`${Prefix}/pets`)
export class PetsController extends BaseController {
  private readonly _petsService: IPetsService;

  constructor(
    @inject(PetsServiceSymbol) private petsService: IPetsService
  ) {
    super()
    this._petsService = petsService;
  }

  @httpPost("")
  public async AddPet(@requestBody() body: Object): Promise<void> {
    await this.AuthorizeOrFail();

    const request = plainToClass(AddPetRequest, body);
    const errors = await validate(request);

    if (errors.length !== 0) {
      throw new ValidationException(errors);
    }

    const userId = await this.GetUserId();
    await this._petsService.AddPet(userId, request.TokenId);
  }

  @httpPut("/experience")
  public async AddExperience(@requestBody() body: Object): Promise<void> {
    await this.AuthorizeOrFail();

    const request = plainToClass(AddExperienceRequest, body);
    const errors = await validate(request);

    if (errors.length !== 0) {
      throw new ValidationException(errors);
    }

    const userId = await this.GetUserId();
    await this._petsService.AddExperience(userId, request.Amount);
  }

  @httpPut("/level")
  public async AddLevel(): Promise<void> {
    await this.AuthorizeOrFail();
    const userId = await this.GetUserId();
    await this._petsService.LevelUp(userId);
  }
}
