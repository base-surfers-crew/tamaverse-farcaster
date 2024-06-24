
import { User } from '../../Persistence/Entities/User';
import { AccessTokenPayload } from './Jwt/AccessTokenPayload';
import { JwtPair } from './Jwt/JwtPair';
import { RefreshTokenPayload } from './Jwt/RefreshTokenPayload';

export interface IJwtService {
  Decode(token: string): Promise<AccessTokenPayload | RefreshTokenPayload>;
  VerifyAndDecode(token: string): Promise<AccessTokenPayload | RefreshTokenPayload>;

  GenerateTokensPair(user: User): Promise<JwtPair>;

  GenerateAccessToken(user: User, jti?: string): Promise<string>;
  GenerateRefreshToken(user: User, jti?: string): Promise<string>;

  IsValidToken(token: string): Promise<boolean>;

  IsValidAccessToken(token: string): Promise<boolean>;
  IsValidRefreshToken(token: string): Promise<boolean>;
}

export const JwtServiceSymbol = 'IJwtService';
