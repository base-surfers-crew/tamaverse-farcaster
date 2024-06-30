import 'reflect-metadata';
import { Container } from 'inversify';
import { HealthCheckController } from './HealthCheckController';
import { PetsController } from './PetsController';

export async function InjectControllers(container: Container): Promise<Container> {
  if (!container.isBound(HealthCheckController.name)) {
    container.bind<HealthCheckController>(HealthCheckController.name).to(HealthCheckController);
  }

  if (!container.isBound(PetsController.name)) {
    container.bind<PetsController>(PetsController.name).to(PetsController);
  }

  return container;
}
