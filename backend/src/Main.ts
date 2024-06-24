import 'reflect-metadata';
import { Container } from 'inversify';
import { ILoggerService, LoggerServiceSymbol } from './Services/Logging/ILoggerService';
import { Bootstrap } from './Bootstrap';
import { Migrate, MigratorCommands } from './Persistence/Migrations/Executables/MigratorPostgresql';
import { FacrasterRpcListenerSymbol, IFarcasterRpcListener } from './Services/Farcaster/IFarcasterRpcListener';

async function Startup() {
  const executionTimeStart = performance.now();

  const container = new Container();
  const instance = await Bootstrap(container);

  // Run migrations
  await Migrate(MigratorCommands.Up);

  // Get these variables AFTER bootstrap finishes in case it configures environment and DI container
  const host = String(process.env.APP_HOST)
  const port = Number(process.env.APP_PORT);
  const logger = container.get<ILoggerService>(LoggerServiceSymbol);

  // Farcaster
  const farcastListener = container.get<IFarcasterRpcListener>(FacrasterRpcListenerSymbol);
  const server = instance.listen(port, host, () => {
    const executionTimeEnd = performance.now();
    const executionTime = (executionTimeEnd - executionTimeStart).toFixed(2);

    logger.Info(`Server started on port ${port} | ${executionTime}ms`);
    
    // farcastListener.Listen();
  });

  process.on("exit", () => {
    logger.Info("Shutting down the application");
    server.close();
    // farcastListener.Close();
    logger.Info("The application has successfully shutted down");
  })
}

Startup();