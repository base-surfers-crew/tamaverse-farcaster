import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  public AccessToken: string;

  @IsString()
  @IsNotEmpty()
  public RefreshToken: string;
}
