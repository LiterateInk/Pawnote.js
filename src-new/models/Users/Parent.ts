import { InnerResource } from "src-new/api/ParametresUtilisateur/response";
import { Authentication } from "../Authentication";
import { Parameters } from "../Parameters";
import { Session } from "../Session";
import { UserParameters } from "../UserParameters";
import { User } from "./User";
import { Student } from "./Student";
import { StudentAdministration } from "../StudentAdministration";

export class Child {
  public readonly administration: StudentAdministration;

  /** @internal */
  public constructor(
    /** @internal */
    public readonly parent: Parent,
    private readonly _raw: InnerResource
  ) {
    this.administration = new StudentAdministration(parent, this);
  }

  public get id(): string {
    return this._raw.id;
  }

  public get name(): string {
    return this._raw.name;
  }

  public get kind(): number {
    return this._raw.kind;
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
    this.children = this.user.ressource.inner!.map((item) => new Child(this, item));
  }
}
