import { ParametresUtilisateurResponse } from "src-new/api/ParametresUtilisateur";

export class UserParameters {
  public constructor(
    private readonly _raw: ParametresUtilisateurResponse
  ) {}
}
