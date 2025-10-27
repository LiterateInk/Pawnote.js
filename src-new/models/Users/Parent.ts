import { Authentication } from "../Authentication";
import { Parameters } from "../Parameters";
import { Session } from "../Session";
import { UserParameters } from "../UserParameters";
import { User } from "./User";

export class Parent extends User {
  public constructor(
    user: UserParameters,
    session: Session,
    parameters: Parameters,
    authentication: Authentication
  ) {
    super(user, session, parameters, authentication);
  }
}
