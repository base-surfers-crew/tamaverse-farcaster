import 'reflect-metadata';
import path from 'path';
import { EntityRepository, EntityName } from '@mikro-orm/core';
import {
  MikroORM, PostgreSqlDriver, SqlEntityManager, QueryBuilder,
} from '@mikro-orm/postgresql';
import { injectable } from 'inversify';
import { ILoggerService } from '../Services/Logging/ILoggerService';
import { IDbContext } from './IDbContext';
import { Entities } from './Entities';
import { BaseEntity } from './Entities/BaseEntity';
import { User } from './Entities/User';

@injectable()
export class PostgresDbContext implements IDbContext {
  public Users: EntityRepository<User>

  private static _db: MikroORM;
  private readonly _logger: ILoggerService;

  constructor() {
    if (PostgresDbContext._db != null) {
      this.InitializeDbSets();
    }
  }

  public async Init(): Promise<void> {
    PostgresDbContext._db = await MikroORM.init<PostgreSqlDriver>({
      migrations: {
        path: path.join(__dirname, './Migrations/Postgresql'),
        pathTs: './src/Persistence/Migrations/Postgresql',
        disableForeignKeys: false,
      },
      discovery: { disableDynamicFileAccess: true },
      entities: Entities,
      dbName: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
  }

  public CreateQueryBuilder<T extends BaseEntity>(entityName: EntityName<T>, alias?: string): QueryBuilder<T> {
    return PostgresDbContext._db.em.fork().createQueryBuilder<T>(entityName, alias);
  }

  public async IsHealthy(): Promise<boolean> {
    return PostgresDbContext._db.isConnected();
  }

  public Fork(): SqlEntityManager {
    return PostgresDbContext._db.em.fork();
  }

  public async SaveChanges(): Promise<void> {
    await PostgresDbContext._db.em.flush();
  }

  private InitializeDbSets() {
    const forkedEntityManager = PostgresDbContext._db.em.fork();

    this.Users = forkedEntityManager.getRepository(User);
  }
}
