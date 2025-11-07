import { Authentication } from "../Authentication";
import { Parameters } from "../Parameters";
import { Session } from "../Session";
import { UserParameters } from "../UserParameters";

export abstract class User {
  /** @internal */
  protected constructor(
    /** @internal */
    public readonly user: UserParameters,
    /** @internal */
    public readonly session: Session,
    /** @internal */
    public readonly parameters: Parameters,
    /** @internal */
    public readonly authentication: Authentication
  ) {}

  public get username(): string {
    return this.authentication.username;
  }

  public get token(): string {
    return this.authentication.token;
  }

  public get uuid(): string {
    return this.authentication.uuid;
  }

  public get id(): string {
    return this.user.ressource.id;
  }

  public get name(): string {
    return this.user.ressource.name;
  }

  public get kind(): number {
    return this.user.ressource.kind;
  }
}
