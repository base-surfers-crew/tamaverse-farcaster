export interface IPetsService {
  AddPet(userId: number, tokenId: number): Promise<void>;
  
  AddExperience(userId: number, amount: number): Promise<void>;

  LevelUp(userId: number): Promise<void>;
}

export const PetsServiceSymbol = "IPetsService"