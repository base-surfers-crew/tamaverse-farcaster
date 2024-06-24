import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { HealthCheckServiceSymbol, IHealthCheckService } from '../Services/HealthCheck/IHealthCheckService';
import { HealthCheckResponse } from '../Infrastructure/DTOs/HealthCheck/Responses/HealthCheckResponse';
import { BaseController } from './BaseController';
import { Prefix } from './Prefix';

@controller(`${Prefix}/health-check`)
export class HealthCheckController extends BaseController {
  private readonly _healthCheckService: IHealthCheckService;

  constructor(@inject(HealthCheckServiceSymbol) private healthCheckService: IHealthCheckService) {
    super();

    this._healthCheckService = healthCheckService;
  }

  @httpGet('')
  public async IsHealthy(): Promise<HealthCheckResponse> {
    return this._healthCheckService.IsHealthy();
  }
}
