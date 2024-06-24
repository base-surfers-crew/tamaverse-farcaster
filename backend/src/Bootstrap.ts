import 'reflect-metadata';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { Application } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { InjectControllers } from './Controllers/DependencyInjection';
import { ExceptionHandler } from './Infrastructure/Middlewares/ExceptionHandlerMiddleware';
import { InjectPersistence } from './Persistence/DependencyInjection';
import { InjectServices } from './Services/DependencyInjection';
import { ILoggerService, LoggerServiceSymbol } from "./Services/Logging/ILoggerService";

export async function Bootstrap(container: Container): Promise<Application> {
  // Setup environmental variables
  const setupVariablesTimeStart = performance.now();

  const nodeEnvironment = process.env.NODE_ENV;

  if (nodeEnvironment !== 'development' && nodeEnvironment !== 'production' && nodeEnvironment !== 'test') {
    throw new Error(`Unexpected value was provided to NODE_ENV: ${nodeEnvironment}`);
  }

  dotenv.config({ path: `.env.${nodeEnvironment}` });

  const setupVariablesTimeEnd = performance.now();
  const setupVariablesTime = (setupVariablesTimeEnd - setupVariablesTimeStart).toFixed(2);

  // Load service instances to DI container

  const loadServicesTimeStart = performance.now();
  await InjectServices(container);
  const loadServicesTimeEnd = performance.now();
  const loadServicesTime = (loadServicesTimeEnd - loadServicesTimeStart).toFixed(2);

  const logger = container.get<ILoggerService>(LoggerServiceSymbol);

  logger.Info(`Setup environmental variables | ${setupVariablesTime}ms`);
  logger.Info(`Loaded services | ${loadServicesTime}ms`);

  const loadControllersTimeStart = performance.now();
  await InjectControllers(container);
  const loadControllersTimeEnd = performance.now();
  const loadControllersTime = (loadControllersTimeEnd - loadControllersTimeStart).toFixed(2);

  logger.Info(`Loaded controllers | ${loadControllersTime}ms`);

  const loadPersistenceTimeStart = performance.now();
  await InjectPersistence(container);
  const loadPersistenceTimeEnd = performance.now();
  const loadPersistenceTime = (loadPersistenceTimeEnd - loadPersistenceTimeStart).toFixed(2);

  logger.Info(`Loaded persistence | ${loadPersistenceTime}ms`);

  // Configure server pipeline

  const createServerTimeStart = performance.now();
  const server = new InversifyExpressServer(container);
  const createServerTimeEnd = performance.now();
  const createServerTime = (createServerTimeEnd - createServerTimeStart).toFixed(2);

  logger.Info(`Created server instance | ${createServerTime}ms`);

  const setConfigTimeStart = performance.now();
  server.setConfig((app) => {
    app.use(bodyParser.json());
    app.use(cors());

    app.set('json replacer', function (key: string, value: any) {
      if (this[key] instanceof Date) {
        [value] = this[key].toISOString().split('T');
      }

      return value;
    });
  });
  const setConfigTimeEnd = performance.now();
  const setConfigTime = (setConfigTimeEnd - setConfigTimeStart).toFixed(2);

  logger.Info(`Set middlewares config | ${setConfigTime}ms`);

  const setErrorConfigTimeStart = performance.now();
  server.setErrorConfig((app) => {
    app.use(ExceptionHandler(container));
  });
  const setErrorConfigTimeEnd = performance.now();
  const setErrorConfigTime = (setErrorConfigTimeEnd - setErrorConfigTimeStart).toFixed(2);

  logger.Info(`Set exception middlewares config | ${setErrorConfigTime}ms`);

  const buildServiceTimeStart = performance.now();
  const application = server.build();
  const buildServiceTimeEnd = performance.now();
  const buildServiceTime = (buildServiceTimeEnd - buildServiceTimeStart).toFixed(2);

  logger.Info(`Built application | ${buildServiceTime}ms`);

  return application;
}
