import { HealthCheckResponse } from '../../Infrastructure/DTOs/HealthCheck/Responses/HealthCheckResponse';

export interface IHealthCheckService {
  IsHealthy(): Promise<HealthCheckResponse>;
}

export const HealthCheckServiceSymbol = 'IHealthCheckService';
