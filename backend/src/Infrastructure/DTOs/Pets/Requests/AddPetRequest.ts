import { IsInt, Min } from "class-validator";

export class AddPetRequest {
  @IsInt()
  @Min(1)
  public TokenId: number;
}
