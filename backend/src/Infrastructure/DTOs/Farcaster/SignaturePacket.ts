import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";

class UntrustedData {
  @IsNumber()
  public fid: number;

  @IsString()
  public url: string;

  @IsString()
  public messageHash: string;

  @IsNumber()
  public timestamp: number;

  @IsNumber()
  public network: number;

  @IsNumber()
  public buttonIndex: number;

  @IsString()
  public inputText: string;

  @IsString()
  public state: string;

  @IsString()
  public transactionId: string;

  @IsString()
  public address: string;
}

class TrustedData {
  @IsString()
  public messageBytes: string;
}

export class SignaturePacket {
  @Type(() => UntrustedData)
  @ValidateNested()
  public untrustedData: UntrustedData;

  @Type(() => TrustedData)
  @ValidateNested()
  public trustedData: TrustedData;
}
