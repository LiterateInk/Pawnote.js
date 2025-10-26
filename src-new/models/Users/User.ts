import { Authentication } from "../Authentication";
import { Parameters } from "../Parameters";
import { Session } from "../Session";
import { UserParameters } from "../UserParameters";

export abstract class User {
  protected constructor(
    protected readonly user: UserParameters,
    protected readonly session: Session,
    protected readonly parameters: Parameters,
    protected readonly authentication: Authentication
  ) {}

  public get username(): string {
    return this.authentication.username;
  }

  public get token(): string {
    return this.authentication.token;
  }
}
