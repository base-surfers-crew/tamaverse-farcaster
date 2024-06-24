import { inject, injectable } from "inversify";
import { DbContextSymbol, IDbContext } from "../../Persistence/IDbContext";
import { IEnergyService } from "./IEnergyService";
import { EnergyUtil } from "../Utils/EnergyUtil";

@injectable()
export class EnergyService implements IEnergyService {
  private readonly _dbContext: IDbContext;

  constructor(
    @inject(DbContextSymbol) private dbContext: IDbContext
  ) {
    this._dbContext = dbContext;
  }

  public async AddEnergy(fid: number, amount: number): Promise<void> {
    const user = await this._dbContext.Users.findOne({ FarcasterId: fid });
    if (user == null) {
      return;
    }

    const maxEnergy = EnergyUtil.CalcMaxEnergy(user.Level);
    if (user.AccumulatedEnergy + amount > maxEnergy) {
      return;
    }

    user.Eneregy += amount;
    user.AccumulatedEnergy += amount;

    await this._dbContext.Users.flush();
  }
}
