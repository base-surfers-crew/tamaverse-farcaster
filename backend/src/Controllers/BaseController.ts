import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { HttpContext, injectHttpContext } from 'inversify-express-utils';
import { UnauthorizedException } from '../Infrastructure/Exceptions/UnauthorizedException';
import { IJwtService, JwtServiceSymbol } from '../Services/Identity/IJwtService';
import { DbContextSymbol, IDbContext } from '../Persistence/IDbContext';
import { AccessTokenPayload } from '../Services/Identity/Jwt/AccessTokenPayload';
import { BadRequestException } from '../Infrastructure/Exceptions/BadRequestException';

@injectable()
export abstract class BaseController {
  @injectHttpContext private readonly _httpContext: HttpContext;

  @inject(DbContextSymbol) private readonly _dbContext: IDbContext;
  @inject(JwtServiceSymbol) private readonly _jwtService: IJwtService;

  public get accessToken() {
    return this._httpContext.request.headers.authorization?.replace('Bearer ', '');
  }

  public async AuthorizeOrFail(): Promise<void> {
    if (this.accessToken == null) {
      throw new UnauthorizedException();
    }

    const isValidToken = await this._jwtService.IsValidAccessToken(this.accessToken);
    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    const payload = (await this._jwtService.Decode(this.accessToken)) as AccessTokenPayload;
    const user = await this._dbContext.Users.findOne({ Id: payload.UserId });

    if (user == null) {
      throw new UnauthorizedException();
    }
  }

  public async GetUserId(): Promise<number> {
    if (this.accessToken == null) {
      throw new UnauthorizedException();
    }

    const payload = (await this._jwtService.Decode(this.accessToken)) as AccessTokenPayload;

    if (payload.UserId == null) {
      throw new BadRequestException('No userId claim was provided at access token');
    }

    return payload.UserId;
  }
}
