import { InnerResource } from "~/api/ParametresUtilisateur/response";
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
    public readonly parent: Parent,
    private readonly inner: InnerResource
  ) {
    this.administration = new StudentAdministration(parent, this);
  }

  public get id(): string {
    return this.inner.id;
  }

  public get name(): string {
    return this.inner.name;
  }

  public get kind(): number {
    return this.inner.kind;
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
    this.children = this.user.resource.listeRessources!.map((item) => new Child(this, item));
  }
}
