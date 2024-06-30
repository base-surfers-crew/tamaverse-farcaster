import { IsString } from "class-validator";

export class SignaturePacket {
  @IsString()
  public messageBytes: string;
}
