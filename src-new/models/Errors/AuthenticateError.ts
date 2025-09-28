export class AuthenticateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticateError";
  }
}
