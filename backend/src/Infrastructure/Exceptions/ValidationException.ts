import { ValidationError } from 'class-validator';

export class ValidationException extends Error {
  public Errors: ValidationError[];

  constructor(validationErrors: ValidationError[]) {
    super('An exception occurred while request validation');

    this.Errors = validationErrors;
  }
}
