export class HealthCheckResponse {
  Services: {
    IsHealthy: boolean;
  };

  Database: {
    IsHealthy: boolean;
  };
}
