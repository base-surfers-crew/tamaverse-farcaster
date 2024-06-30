import { EntityRepository, EntityName } from '@mikro-orm/core';
import {
  SqlEntityManager as SqlEntityManagerPostgresql,
  QueryBuilder as QueryBuilderPostgres,
} from '@mikro-orm/postgresql';
import { BaseEntity } from './Entities/BaseEntity';
import { User } from './Entities/User';

export interface IDbContext {
  Users: EntityRepository<User>;  

  Init(): Promise<void>;

  CreateQueryBuilder<T extends BaseEntity>(entityName: EntityName<T>, alias?: string): QueryBuilderPostgres<T>

  IsHealthy(): Promise<boolean>;

  Fork(): SqlEntityManagerPostgresql
}

export const DbContextSymbol = 'IDbContext';
