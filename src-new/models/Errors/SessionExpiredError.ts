export class SessionExpiredError extends Error {
  constructor() {
    super("The session has expired");
    this.name = "SessionExpiredError";
  }
}
