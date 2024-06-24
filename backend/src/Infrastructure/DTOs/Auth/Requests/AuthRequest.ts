import { IsString } from "class-validator";

export class AuthRequest {
  @IsString()
  public message: string;

  @IsString()
  public signature: string;

  @IsString()
  public nonce: string;
}
