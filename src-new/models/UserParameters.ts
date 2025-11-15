import { ParametresUtilisateurResponse } from "../api/ParametresUtilisateur";
import { Ressource } from "../api/ParametresUtilisateur/response";

export class UserParameters {
  public constructor(
    private readonly user: ParametresUtilisateurResponse
  ) {}

  public get resource(): Ressource {
    return this.user.data.resource;
  }
}
