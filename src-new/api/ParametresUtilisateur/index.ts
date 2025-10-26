import { Session } from "src-new/models";
import { RequestFunction } from "src-new/models/RequestFunction";
import { ResponseFunction, ResponseFunctionWrapper } from "src-new/models/ResponseFunction";
import { ParametresUtilisateurRequest } from "./request";
import { ParametresUtilisateurModel } from "./response";

export type ParametresUtilisateurResponse = ResponseFunctionWrapper<ParametresUtilisateurModel>;

export class ParametresUtilisateur extends RequestFunction<ParametresUtilisateurRequest> {
  public static readonly name = "ParametresUtilisateur";

  private readonly decoder = new ResponseFunction(
    this.session,
    ParametresUtilisateurModel
  );

  public constructor(session: Session) {
    super(session, ParametresUtilisateur.name);
  }

  public async send(): Promise<ParametresUtilisateurResponse> {
    const response = await this.execute({});
    return this.decoder.decode(response);
  }
}
