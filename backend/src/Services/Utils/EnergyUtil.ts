export class EnergyUtil {
  public static CalcMaxEnergy(level: number): number {
    return 100 * Math.log(level + 1);
  }
}