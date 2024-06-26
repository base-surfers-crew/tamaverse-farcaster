import { Container } from "inversify";
import { IJob } from "./IJob";
import { DbContextSymbol, IDbContext } from "../../../Persistence/IDbContext";

export class RefreshEnergyJob implements IJob {
  private readonly _diContainer: Container;

  constructor(container: Container) {
    this._diContainer = container;
  }

  public async executeAsync(): Promise<void> {
    const dbContext = this._diContainer.get<IDbContext>(DbContextSymbol);
    const users = await dbContext.Users.findAll();

    for (const user of users) {
      user.AccumulatedEnergy = 0;
    }

    await dbContext.Users.flush();
  }
}