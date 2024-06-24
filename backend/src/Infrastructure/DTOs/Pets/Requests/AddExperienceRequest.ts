import { IsNumber, Min } from "class-validator";

export class AddExperienceRequest {
  @IsNumber()
  @Min(1)
  public Amount: number;
}
