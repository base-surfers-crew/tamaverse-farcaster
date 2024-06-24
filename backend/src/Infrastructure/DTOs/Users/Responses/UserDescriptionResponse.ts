import { AutoMap } from "@automapper/classes";

export class UserDescriptionResponse {
  @AutoMap()
  public Id: number;

  @AutoMap()
  public FarcasterId: number;

  @AutoMap()
  public Level: number;

  @AutoMap()
  public WalletAddress: string;

  @AutoMap()
  public CurrentEnergy: number;

  @AutoMap()
  public AccumulatedEnergyForToday: number;

  @AutoMap()
  public MaxEnergyForToday: number;

  @AutoMap()
  public CurrentExperience: number;

  @AutoMap()
  public ExperienceRequiredForLevelUp: number;
}
