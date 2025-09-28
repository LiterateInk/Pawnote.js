export class ServerSideError extends Error {
  constructor(message = "An error occurred, server-side") {
    super(message);
    this.name = "ServerSideError";
  }
}
