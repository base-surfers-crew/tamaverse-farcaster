import { AuthRequest } from "../../Infrastructure/DTOs/Auth/Requests/AuthRequest";
import { LogoutRequest } from "../../Infrastructure/DTOs/Auth/Requests/LogoutRequest";
import { RefreshTokenRequest } from "../../Infrastructure/DTOs/Auth/Requests/RefreshTokenRequest";
import { AuthResponse } from "../../Infrastructure/DTOs/Auth/Responses/AuthResponse";

export interface IAuthService {
  Authorize(request: AuthRequest): Promise<AuthResponse>;

  RefreshToken(request: RefreshTokenRequest): Promise<AuthResponse>;

  Logout(accessToken: string, request: LogoutRequest): Promise<void>;
}

export const AuthServiceSymbol = 'IAuthService';
