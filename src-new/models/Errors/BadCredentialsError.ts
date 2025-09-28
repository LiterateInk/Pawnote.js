export class BadCredentialsError extends Error {
  constructor() {
    super("Unable to resolve the challenge, make sure the credentials or token are corrects");
    this.name = "BadCredentialsError";
  }
}
