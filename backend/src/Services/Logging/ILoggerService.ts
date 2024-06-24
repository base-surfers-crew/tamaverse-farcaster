export interface ILoggerService {
  Info(message: string): void;

  Warn(message: string): void;

  Error(error: Error): void;
}

export const LoggerServiceSymbol = 'ILoggerService';
