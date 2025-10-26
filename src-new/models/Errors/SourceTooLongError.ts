export class SourceTooLongError extends Error {
  constructor (limit: number) {
    super(`Source name is too long, should be less or equal than ${limit} characters`);
    this.name = "SourceTooLongError";
  }
}
