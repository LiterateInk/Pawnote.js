export class SuspendedIpError extends Error {
  constructor() {
    super("Your IP address has been suspended");
    this.name = "SuspendedIpError";
  }
}
