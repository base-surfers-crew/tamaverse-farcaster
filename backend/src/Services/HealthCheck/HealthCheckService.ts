import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IHealthCheckService } from './IHealthCheckService';
import { HealthCheckResponse } from '../../Infrastructure/DTOs/HealthCheck/Responses/HealthCheckResponse';
import { DbContextSymbol, IDbContext } from '../../Persistence/IDbContext';

@injectable()
export class HealthCheckService implements IHealthCheckService {
  private readonly _dbContext: IDbContext;

  constructor(@inject(DbContextSymbol) dbContext: IDbContext) {
    this._dbContext = dbContext;
  }

  public async IsHealthy(): Promise<HealthCheckResponse> {
    return {
      Services: {
        IsHealthy: true,
      },
      Database: {
        IsHealthy: await this._dbContext.IsHealthy(),
      },
    };
  }
}
