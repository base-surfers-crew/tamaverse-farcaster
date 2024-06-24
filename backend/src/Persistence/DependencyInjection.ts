import 'reflect-metadata';
import { Container } from 'inversify';
import { DbContextSymbol, IDbContext } from './IDbContext';
import { PostgresDbContext } from './PostgresDbContext';

export async function InjectPersistence(container: Container): Promise<Container> {
  if (!container.isBound(DbContextSymbol)) {
    container.bind<IDbContext>(DbContextSymbol).to(PostgresDbContext);
  }

  const dbContext: IDbContext = container.get<IDbContext>(DbContextSymbol);
  await dbContext.Init();

  return container;
}
