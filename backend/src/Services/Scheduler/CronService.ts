import { Container } from "inversify";
import { RefreshEnergyJob } from "./Jobs/RefreshEnergyJob";
import cron from "node-cron";
import { ILoggerService, LoggerServiceSymbol } from "../Logging/ILoggerService";

export class CronService {
  private readonly _diContainer: Container;
  private readonly _logger: ILoggerService;

  constructor(container: Container) {
    this._diContainer = container;
    this._logger = container.get<ILoggerService>(LoggerServiceSymbol);
  }

  public StartScheduling(): void {
    const refreshEnergyJob = new RefreshEnergyJob(this._diContainer);
    const refreshEnergyCronExpression = "0 0 * * *";

    cron.schedule(refreshEnergyCronExpression, refreshEnergyJob.executeAsync.bind(refreshEnergyJob));
    this._logger.Info(`Register ${refreshEnergyJob.constructor.name} job with expression: "${refreshEnergyCronExpression}"`);
  }
}