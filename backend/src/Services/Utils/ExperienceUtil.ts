export class ExperienceUtil {
  public static RequiredForLevelUp(level: number): number {
    return 100 * Math.log(level + 1);
  }
}