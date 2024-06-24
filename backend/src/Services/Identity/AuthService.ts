import { inject, injectable } from "inversify";
import { AuthRequest } from "../../Infrastructure/DTOs/Auth/Requests/AuthRequest";
import { LogoutRequest } from "../../Infrastructure/DTOs/Auth/Requests/LogoutRequest";
import { RefreshTokenRequest } from "../../Infrastructure/DTOs/Auth/Requests/RefreshTokenRequest";
import { AuthResponse } from "../../Infrastructure/DTOs/Auth/Responses/AuthResponse";
import { DbContextSymbol, IDbContext } from "../../Persistence/IDbContext";
import { IAuthService } from "./IAuthService";
import { IJwtService, JwtServiceSymbol } from "./IJwtService";
import { AccessTokenPayload } from "./Jwt/AccessTokenPayload";
import { RefreshTokenPayload } from "./Jwt/RefreshTokenPayload";
import { BadRequestException } from "../../Infrastructure/Exceptions/BadRequestException";
import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { User } from "../../Persistence/Entities/User";
import { UnauthorizedException } from "../../Infrastructure/Exceptions/UnauthorizedException";

@injectable()
export class AuthService implements IAuthService {
  private readonly _appDomain = process.env.APP_DOMAIN;
  private readonly _rpcNode = process.env.ETH_RPC_NODE;

  private readonly _dbContext: IDbContext;
  private readonly _jwtService: IJwtService;

  constructor(
    @inject(DbContextSymbol) private dbContext: IDbContext,
    @inject(JwtServiceSymbol) private jwtService: IJwtService,
  ) {
    this._dbContext = dbContext;
    this._jwtService = jwtService;
  }

  public async Authorize(request: AuthRequest): Promise<AuthResponse> {
    const appClient = createAppClient({
      ethereum: viemConnector({ rpcUrl: this._rpcNode }),
    });

    const verifyResponse = await appClient.verifySignInMessage({
        message: request.message,
        signature: request.signature as `0x${string}`,
        domain: this._appDomain,
        nonce: request.nonce,
    });

    const { data, success, fid } = verifyResponse;
    if (!success) {
        throw new UnauthorizedException("Message was not verified");
    }

    let user = await this._dbContext.Users.findOne({ FarcasterId: fid });
    if (user == null) {
      user = new User(fid, data.address);
      await this._dbContext.Users.persistAndFlush(user);
    }

    return this._jwtService.GenerateTokensPair(user);
  }

  public async RefreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    const accessPayload = (await this._jwtService.VerifyAndDecode(request.AccessToken)) as AccessTokenPayload;
    const refreshPayload = (await this._jwtService.VerifyAndDecode(request.RefreshToken)) as RefreshTokenPayload;

    const storedRefreshToken = await this._dbContext.RefreshTokens.findOne(
      {
        Token: request.RefreshToken,
        Jti: refreshPayload.jti,
      },
      { populate: ['User'] },
    );

    if (storedRefreshToken == null) {
      throw new BadRequestException('Invalid token');
    }

    if (storedRefreshToken.ExpirationDate < new Date()) {
      throw new BadRequestException('Invalid token');
    }

    if (accessPayload.jti !== refreshPayload.jti) {
      throw new BadRequestException('Invalid token');
    }

    await this._dbContext.RefreshTokens.removeAndFlush(storedRefreshToken);
    return this._jwtService.GenerateTokensPair(storedRefreshToken.User);
  }

  public async Logout(accessToken: string, request: LogoutRequest): Promise<void> {
    const accessPayload = (await this._jwtService.VerifyAndDecode(accessToken)) as AccessTokenPayload;
    const refreshPayload = (await this._jwtService.VerifyAndDecode(request.RefreshToken)) as RefreshTokenPayload;

    const storedRefreshToken = await this._dbContext.RefreshTokens.findOne({
      Token: request.RefreshToken,
      Jti: refreshPayload.jti,
    });

    if (storedRefreshToken == null) {
      throw new BadRequestException('Invalid token');
    }

    if (storedRefreshToken.ExpirationDate < new Date()) {
      throw new BadRequestException('Invalid token');
    }

    if (accessPayload.jti !== refreshPayload.jti) {
      throw new BadRequestException('Invalid token');
    }

    await this._dbContext.RefreshTokens.removeAndFlush(storedRefreshToken);
  }
}
