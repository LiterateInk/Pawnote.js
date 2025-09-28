export class PageUnavailableError extends Error {
  constructor() {
    super("The requested page does not exist");
    this.name = "PageUnavailableError";
  }
}
