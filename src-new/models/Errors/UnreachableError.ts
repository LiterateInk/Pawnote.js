export class UnreachableError extends Error {
  constructor(fn: string) {
    super(`Unhandled code reached in "${fn}" function (pawnote), please report this issue`);
    this.name = "UnreachableError";
  }
}
