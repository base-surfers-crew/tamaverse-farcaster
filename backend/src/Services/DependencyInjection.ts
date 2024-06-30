import 'reflect-metadata';
import { Container } from 'inversify';
import { HealthCheckService } from './HealthCheck/HealthCheckService';
import { HealthCheckServiceSymbol, IHealthCheckService } from './HealthCheck/IHealthCheckService';
import { ILoggerService, LoggerServiceSymbol } from './Logging/ILoggerService';
import { LoggerService } from './Logging/LoggerService';
import { EnergyServiceSymbol, IEnergyService } from './Energy/IEnergyService';
import { EnergyService } from './Energy/EnergyService';
import { FacrasterRpcListenerSymbol, IFarcasterRpcListener } from './Farcaster/IFarcasterRpcListener';
import { FarcasterRpcListener } from './Farcaster/FarcasterRpcListener';
import { BlockchainServiceSymbol, IBlockchainService } from './Blockchain/IBlockchainService';
import { BlockchainService } from './Blockchain/BlockchainService';
import { IMapper, MapperSymbol } from '../Infrastructure/Mapper/IMapper';
import { Mapper } from '../Infrastructure/Mapper/Mapper';

export async function InjectServices(container: Container): Promise<Container> {
  if (!container.isBound(MapperSymbol)) {
    container.bind<IMapper>(MapperSymbol).to(Mapper);
  }

  if (!container.isBound(HealthCheckServiceSymbol)) {
    container.bind<IHealthCheckService>(HealthCheckServiceSymbol).to(HealthCheckService);
  }

  if (!container.isBound(LoggerServiceSymbol)) {
    container.bind<ILoggerService>(LoggerServiceSymbol).to(LoggerService);
  }

  if (!container.isBound(EnergyServiceSymbol)) {
    container.bind<IEnergyService>(EnergyServiceSymbol).to(EnergyService);
  }

  if (!container.isBound(FacrasterRpcListenerSymbol)) {
    container.bind<IFarcasterRpcListener>(FacrasterRpcListenerSymbol).to(FarcasterRpcListener);
  }

  if (!container.isBound(BlockchainServiceSymbol)) {
    container.bind<IBlockchainService>(BlockchainServiceSymbol).to(BlockchainService);
  }

  return container;
}
