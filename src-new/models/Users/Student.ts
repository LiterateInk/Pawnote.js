import { Authentication } from "../Authentication";
import { Parameters } from "../Parameters";
import { Session } from "../Session";
import { StudentAdministration } from "../StudentAdministration";
import { UserParameters } from "../UserParameters";
import { User } from "./User";

export class Student extends User {
  public readonly administration: StudentAdministration;

  public constructor(
    user: UserParameters,
    session: Session,
    parameters: Parameters,
    authentication: Authentication
  ) {
    super(user, session, parameters, authentication);
    this.administration = new StudentAdministration(this);
  }
}
