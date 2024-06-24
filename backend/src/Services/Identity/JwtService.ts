import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { inject, injectable } from 'inversify';
import { IJwtService } from './IJwtService';
import { JwtPair } from './Jwt/JwtPair';
import { AccessTokenPayload } from './Jwt/AccessTokenPayload';
import { RefreshTokenPayload } from './Jwt/RefreshTokenPayload';
import { ILoggerService, LoggerServiceSymbol } from '../Logging/ILoggerService';
import { DbContextSymbol, IDbContext } from '../../Persistence/IDbContext';
import { BadRequestException } from '../../Infrastructure/Exceptions/BadRequestException';
import { User } from '../../Persistence/Entities/User';
import { RefreshToken } from '../../Persistence/Entities/RefreshToken';

@injectable()
export class JwtService implements IJwtService {
  private readonly _logger: ILoggerService;
  private readonly _dbContext: IDbContext;

  private readonly _accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  private readonly _refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  private readonly _accessTokenLifetimeInSeconds = process.env.ACCESS_TOKEN_LIFETIME_IN_SECONDS;
  private readonly _refreshTokenLifetimeInSeconds = process.env.REFRESH_TOKEN_LIFETIME_IN_SECONDS;

  private readonly _issuer = `TamaverseIdentity_${process.env.NODE_ENV}`;
  private readonly _audience = `TamaverseApi_${process.env.NODE_ENV}`;

  constructor(@inject(LoggerServiceSymbol) logger: ILoggerService, @inject(DbContextSymbol) dbContext: IDbContext) {
    this._logger = logger;
    this._dbContext = dbContext;

    if (
      (this._accessTokenSecret == null ||
      this._refreshTokenSecret == null ||
      this._accessTokenLifetimeInSeconds == null ||
      this._refreshTokenLifetimeInSeconds == null) &&
      process.env.IGNORE_JWT_CREDENTIALS !== "1"
    ) {
      this._logger.Warn('Environmental variables in JWT service was not properly initialized');
    }
  }

  public async Decode(token: string): Promise<AccessTokenPayload | RefreshTokenPayload> {
    return jwt.decode(token) as any;
  }

  public async VerifyAndDecode(token: string): Promise<AccessTokenPayload | RefreshTokenPayload> {
    const isValidToken = this.IsValidToken(token);

    if (!isValidToken) {
      throw new BadRequestException('Invalid token');
    }

    return jwt.decode(token) as any;
  }

  public async GenerateTokensPair(user: User): Promise<JwtPair> {
    const jti = v4();

    const AccessToken = await this.GenerateAccessToken(user, jti);
    const RefreshToken = await this.GenerateRefreshToken(user, jti);

    return {
      AccessToken,
      RefreshToken,
    };
  }

  public async IsValidToken(token: string): Promise<boolean> {
    const isValidAccess = await this.IsValidAccessToken(token);
    const isValidRefresh = await this.IsValidRefreshToken(token);

    return isValidAccess || isValidRefresh;
  }

  public async GenerateAccessToken(user: User, jti?: string): Promise<string> {
    const accessTokenPayload = new AccessTokenPayload(
      user.Id,
      user.FarcasterId
    );

    Object.keys(accessTokenPayload).forEach((key) => (accessTokenPayload[key] === undefined ? delete accessTokenPayload[key] : {}));

    return jwt.sign({ ...accessTokenPayload }, this._accessTokenSecret, {
      expiresIn: `${this._accessTokenLifetimeInSeconds}s`,
      issuer: this._issuer,
      audience: this._audience,
      jwtid: jti,
    });
  }

  public async GenerateRefreshToken(user: User, jti?: string): Promise<string> {
    const refreshTokenPayload = new RefreshTokenPayload(user.Id, user.FarcasterId);

    Object.keys(refreshTokenPayload).forEach((key) => (refreshTokenPayload[key] === undefined ? delete refreshTokenPayload[key] : {}));

    const token = jwt.sign({ ...refreshTokenPayload }, this._refreshTokenSecret, {
      expiresIn: `${this._refreshTokenLifetimeInSeconds}s`,
      issuer: this._issuer,
      audience: this._audience,
      jwtid: jti,
    });

    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + Number(this._refreshTokenLifetimeInSeconds) * 1000);

    const tokenEntity = new RefreshToken(user, token, jti, expirationDate);

    await this._dbContext.RefreshTokens.persistAndFlush(tokenEntity);

    return token;
  }

  public async IsValidAccessToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this._accessTokenSecret, {
        issuer: this._issuer,
        audience: this._audience,
      });
    } catch {
      return false;
    }

    return true;
  }

  public async IsValidRefreshToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this._refreshTokenSecret, {
        issuer: this._issuer,
        audience: this._audience,
      });
    } catch {
      return false;
    }

    return true;
  }
}
