import 'reflect-metadata';
import { injectable } from 'inversify';
import { stdout } from 'process';
import { LogLevel } from './LogLevel';
import { ILoggerService } from './ILoggerService';

@injectable()
export class LoggerService implements ILoggerService {
  public Info(message: string): void {
    this.WriteMessage(LogLevel.INFO, message);
  }

  public Warn(message: string): void {
    this.WriteMessage(LogLevel.WARN, message);
  }

  public Error(error: Error): void {
    this.WriteMessage(LogLevel.ERROR, `${error.message}\nCall stack: ${error.stack}`);
  }

  private WriteMessage(level: LogLevel, message: string): void {
    let formattedLevel = '';

    switch (level) {
      case LogLevel.INFO:
        formattedLevel = '\x1b[32m[info]\x1b[0m';
        break;

      case LogLevel.WARN:
        formattedLevel = '\x1b[33m[warn]\x1b[0m';
        break;

      case LogLevel.ERROR:
        formattedLevel = '\x1b[31m[error]\x1b[0m';
        break;

      default:
        throw new Error(`Unexpected value was provided for LogLevel: ${level}`);
    }

    const formattedDateTime = new Date().toISOString();

    stdout.write(`${formattedLevel} | ${formattedDateTime} | ${message}\n`);
  }
}
