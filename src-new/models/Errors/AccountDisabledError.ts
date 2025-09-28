export class AccountDisabledError extends Error {
  constructor() {
    super("Your account has been deactivated");
    this.name = "AccountDisabledError";
  }
}
