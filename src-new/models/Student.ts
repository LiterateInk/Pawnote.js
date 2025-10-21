import { Authentication } from "./Authentication";
import { Parameters } from "./Parameters";
import { Session } from "./Session";

export class Student {
  public constructor(
    private readonly session: Session,
    private readonly parameters: Parameters,
    private readonly authentication: Authentication
  ) {}
}
