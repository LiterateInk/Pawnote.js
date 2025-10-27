import { ParametresUtilisateurResponse } from "../api/ParametresUtilisateur";
import { Ressource } from "../api/ParametresUtilisateur/response";

export class UserParameters {
  public constructor(
    private readonly _raw: ParametresUtilisateurResponse
  ) {}

  public get ressource(): Ressource {
    return this._raw.data.resource;
  }
}
