import { EntityRepository, EntityName } from '@mikro-orm/core';
import {
  SqlEntityManager as SqlEntityManagerPostgresql,
  QueryBuilder as QueryBuilderPostgres,
} from '@mikro-orm/postgresql';
import { User } from './Entities/User';
import { BaseEntity } from './Entities/BaseEntity';
import { RefreshToken } from './Entities/RefreshToken';
import { Pet } from './Entities/Pet';

export interface IDbContext {
  Users: EntityRepository<User>;
  Pets: EntityRepository<Pet>;
  RefreshTokens: EntityRepository<RefreshToken>;

  Init(): Promise<void>;

  CreateQueryBuilder<T extends BaseEntity>(entityName: EntityName<T>, alias?: string): QueryBuilderPostgres<T>

  IsHealthy(): Promise<boolean>;

  Fork(): SqlEntityManagerPostgresql
}

export const DbContextSymbol = 'IDbContext';
