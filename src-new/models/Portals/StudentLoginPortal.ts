import { Instance } from "../Instance";
import { PendingLogin } from "../PendingLogin";
import { Student } from "../Users/Student";
import { Webspace } from "../Webspace";
import { LoginPortal } from "./LoginPortal";

export class StudentLoginPortal extends LoginPortal {
  public constructor (instance: Instance) {
    super(instance);
  }

  public async credentials(
    username: string,
    password: string,
    deviceUUID = crypto.randomUUID() as string,
    navigatorIdentifier: string | null = null
  ): Promise<PendingLogin> {
    return super._credentials(
      Webspace.Students,
      username,
      password,
      deviceUUID,
      navigatorIdentifier
    );
  }

  public async token(
    username: string,
    token: string,
    deviceUUID: string,
    navigatorIdentifier: string | null = null
  ): Promise<PendingLogin> {
    return super._token(
      Webspace.Students,
      username,
      token,
      deviceUUID,
      navigatorIdentifier
    );
  }

  public async finish(login: PendingLogin): Promise<Student> {
    return new Student(
      await super._finish(login),
      login._session,
      login._parameters,
      login._authentication
    );
  }
}
