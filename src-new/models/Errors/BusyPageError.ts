export class BusyPageError extends Error {
  constructor() {
    super("The site is temporarily unavailable");
    this.name = "BusyPageError";
  }
}
