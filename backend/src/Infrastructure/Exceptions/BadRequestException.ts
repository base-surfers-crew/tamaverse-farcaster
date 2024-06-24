export class BadRequestException extends Error {
  public Property?: string;

  constructor(message: string);
  constructor(message: string, property: string);

  constructor(message: string, property?: string) {
    super(message);

    this.Property = property;
  }
}
