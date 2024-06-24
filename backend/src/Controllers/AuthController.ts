import { controller, httpPost, requestBody } from "inversify-express-utils";
import { BaseController } from "./BaseController";
import { AuthServiceSymbol, IAuthService } from "../Services/Identity/IAuthService";
import { inject } from "inversify";
import { Prefix } from "./Prefix";
import { AuthResponse } from "../Infrastructure/DTOs/Auth/Responses/AuthResponse";
import { AuthRequest } from "../Infrastructure/DTOs/Auth/Requests/AuthRequest";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../Infrastructure/Exceptions/ValidationException";
import { RefreshTokenRequest } from "../Infrastructure/DTOs/Auth/Requests/RefreshTokenRequest";
import { LogoutRequest } from "../Infrastructure/DTOs/Auth/Requests/LogoutRequest";

@controller(`${Prefix}/auth`)
export class AuthController extends BaseController {
  private readonly _authService: IAuthService;

  constructor(
    @inject(AuthServiceSymbol) private authService: IAuthService,
  ) {
    super();
    
    this._authService = authService;
  }

  @httpPost("")
  public async Authorize(@requestBody() body: Object): Promise<AuthResponse> {
    const request = plainToClass(AuthRequest, body);
    const errors = await validate(request);

    if (errors.length !== 0) {
      throw new ValidationException(errors);
    }

    return this._authService.Authorize(request);
  }

  @httpPost("/refresh")
  public async RefreshToken(@requestBody() body: Object): Promise<AuthResponse> {
    const request = plainToClass(RefreshTokenRequest, body);
    const errors = await validate(request);

    if (errors.length !== 0) {
      throw new ValidationException(errors);
    }

    return this._authService.RefreshToken(request);
  }

  @httpPost("/logout")
  public async Logout(@requestBody() body: Object): Promise<void> {
    await this.AuthorizeOrFail();

    const request = plainToClass(LogoutRequest, body);
    const errors = await validate(request);

    if (errors.length !== 0) {
      throw new ValidationException(errors);
    }

    await this._authService.Logout(this.accessToken, request);
  }
}
