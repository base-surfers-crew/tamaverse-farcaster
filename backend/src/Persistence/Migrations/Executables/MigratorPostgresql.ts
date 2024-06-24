import { MikroORM } from '@mikro-orm/core';
import dotenv from 'dotenv';
import path from 'path';
import { Entities } from '../../Entities';

export enum MigratorCommands {
  Generate = 'generate',
  Create = 'create',
  Up = 'up',
  Down = 'down',
}

if (process.argv[2] != null && Object.values(MigratorCommands).includes(process.argv[2] as any)) {
  Migrate();
}

export async function Migrate(arg?: MigratorCommands): Promise<void> {
  const appEnv = process.env.NODE_ENV;

  if (appEnv !== 'development' && appEnv !== 'production') {
    throw new Error(`Incorrect app environment was provided: ${appEnv}`);
  }

  dotenv.config({ path: `.env.${appEnv}` });

  const orm = await MikroORM.init({
    migrations: {
      path: path.join(__dirname, '../Postgresql'),
      pathTs: './src/Persistence/Migrations/Postgresql',
    },
    discovery: { disableDynamicFileAccess: true },
    entities: Entities,
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    type: 'postgresql',
  });

  const command = arg ?? process.argv[2]?.toLowerCase();
  const migrator = orm.getMigrator();

  switch (command) {
    case MigratorCommands.Generate:
      await migrator.createMigration('./src/Persistence/Migrations');
      break;

    case MigratorCommands.Create:
      await migrator.createMigration('./src/Persistence/Migrations', true);
      break;

    case MigratorCommands.Up:
      await migrator.up();
      break;

    case MigratorCommands.Down:
      await migrator.down();
      break;

    default:
      throw new Error(`Invalid migrator command: ${command}\nAvailable: generate | create | up | down`);
  }

  await orm.close(true);
}
