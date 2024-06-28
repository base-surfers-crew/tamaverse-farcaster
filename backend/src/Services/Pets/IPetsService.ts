import { LevelUpResponse } from "../../Infrastructure/DTOs/Pets/Responses/LevelUpResponse";

export interface IPetsService {
  AddPet(userId: number, tokenId: number): Promise<void>;
  
  AddExperience(userId: number, amount: number): Promise<void>;

  LevelUp(userId: number): Promise<LevelUpResponse>;
}

export const PetsServiceSymbol = "IPetsService"