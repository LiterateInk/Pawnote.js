import { InnerResource } from "src-new/api/ParametresUtilisateur/response";
import { Authentication } from "../Authentication";
import { Parameters } from "../Parameters";
import { Session } from "../Session";
import { UserParameters } from "../UserParameters";
import { User } from "./User";

export class Child {
  /** @internal */
  public constructor(
    private readonly _raw: InnerResource
  ) {}

  public get id(): string {
    return this._raw.id;
  }

  public get name(): string {
    return this._raw.name;
  }
}

export class Parent extends User {
  public readonly children: Array<Child>;

  /** @internal */
  public constructor(
    user: UserParameters,
    session: Session,
    parameters: Parameters,
    authentication: Authentication
  ) {
    super(user, session, parameters, authentication);
    this.children = this.user.ressource.inner!.map((item) => new Child(item));
  }
}
