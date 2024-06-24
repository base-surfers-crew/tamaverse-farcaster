import { controller, httpGet } from "inversify-express-utils";
import { IUserService, UserServiceSymbol } from "../Services/Users/IUserService";
import { BaseController } from "./BaseController";
import { Prefix } from "./Prefix";
import { inject } from "inversify";
import { UserDescriptionResponse } from "../Infrastructure/DTOs/Users/Responses/UserDescriptionResponse";

@controller(`${Prefix}/users`)
export class UserController extends BaseController {
  private readonly _usersService: IUserService;

  constructor(
    @inject(UserServiceSymbol) private usersService: IUserService
  ) {
    super()
    this._usersService = usersService;
  }

  @httpGet("")
  public async GetCurrentUser(): Promise<UserDescriptionResponse> {
    await this.AuthorizeOrFail();
    const userId = await this.GetUserId();
    return this._usersService.GetUserById(userId);
  }
}
