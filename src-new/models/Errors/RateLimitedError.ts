export class RateLimitedError extends Error {
  constructor() {
    super("You've been rate-limited");
    this.name = "RateLimitedError";
  }
}
