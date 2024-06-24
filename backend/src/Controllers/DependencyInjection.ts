import 'reflect-metadata';
import { Container } from 'inversify';
import { HealthCheckController } from './HealthCheckController';
import { AuthController } from './AuthController';
import { PetsController } from './PetsController';
import { UserController } from './UserController';

export async function InjectControllers(container: Container): Promise<Container> {
  if (!container.isBound(HealthCheckController.name)) {
    container.bind<HealthCheckController>(HealthCheckController.name).to(HealthCheckController);
  }

  if (!container.isBound(AuthController.name)) {
    container.bind<AuthController>(AuthController.name).to(AuthController);
  }

  if (!container.isBound(PetsController.name)) {
    container.bind<PetsController>(PetsController.name).to(PetsController);
  }

  if (!container.isBound(UserController.name)) {
    container.bind<UserController>(UserController.name).to(UserController);
  }

  return container;
}
