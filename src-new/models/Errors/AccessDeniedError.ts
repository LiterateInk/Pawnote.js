export class AccessDeniedError extends Error {
  constructor() {
    super("You do not have access to this area or your authorizations are insufficient");
    this.name = "AccessDeniedError";
  }
}
