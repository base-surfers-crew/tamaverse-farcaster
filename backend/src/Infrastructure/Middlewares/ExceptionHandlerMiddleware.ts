import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'inversify';
import { ValidationError } from 'class-validator';
import { ILoggerService, LoggerServiceSymbol } from '../../Services/Logging/ILoggerService';
import { BadRequestException } from '../Exceptions/BadRequestException';
import { ForbiddenException } from '../Exceptions/ForbiddenException';
import { NotFoundException } from '../Exceptions/NotFoundException';
import { UnauthorizedException } from '../Exceptions/UnauthorizedException';
import { ValidationException } from '../Exceptions/ValidationException';

function SerializeValidationError(error: ValidationError, parentProperty: string = null): { [key: string]: string } {
  const serializedError: { [key: string]: string } = {};

  if (error?.children) {
    for (const child of error.children) {
      let propKey = error.property;

      if (parentProperty != null) {
        propKey = `${parentProperty}.${propKey}`;
      }

      Object.assign(serializedError, SerializeValidationError(child, propKey));
    }
  }

  const constraints = Object.values(error?.constraints ?? {});

  for (let i = 0; i < constraints.length; i += 1) {
    constraints[i] = constraints[i].charAt(0).toUpperCase() + constraints[i].slice(1);
  }

  if (constraints.length > 0) {
    let key = error.property;

    if (parentProperty != null) {
      key = `${parentProperty}.${error.property}`;
    }

    serializedError[key] = constraints.join('. ');
  }

  return serializedError;
}

export function ExceptionHandler(container: Container) {
  return (err: Error, req: Request, res: Response, _: NextFunction) => {
    const logger = container.get<ILoggerService>(LoggerServiceSymbol);
    logger.Error(err);

    const Errors: { [key: string]: string } = {};

    if (err instanceof BadRequestException) {
      res = res.status(400);

      const key = err.Property ?? 'GeneralError';
      Errors[key] = err.message;
    } else if (err instanceof NotFoundException) {
      res = res.status(404);

      const key = err.Property ?? 'GeneralError';
      Errors[key] = err.message;
    } else if (err instanceof UnauthorizedException) {
      res = res.status(401);
      Errors.GeneralError = err.message;
    } else if (err instanceof ForbiddenException) {
      res = res.status(403);
      Errors.GeneralError = err.message;
    } else if (err instanceof ValidationException) {
      res = res.status(400);

      for (const error of err.Errors) {
        const serializedError = SerializeValidationError(error);
        Object.assign(Errors, serializedError);
      }
    } else {
      res = res.status(500);
      Errors.GeneralError = err.message;
    }

    res.send({
      Errors,
    });
  };
}
