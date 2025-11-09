import { Session } from "~/models";
import { RequestFunction } from "~/models/RequestFunction";
import { ResponseFunction, ResponseFunctionWrapper } from "~/models/ResponseFunction";
import { ParametresUtilisateurRequest } from "./request";
import { ParametresUtilisateurModel, ParametresUtilisateurSignature } from "./response";

export type ParametresUtilisateurResponse = ResponseFunctionWrapper<ParametresUtilisateurModel, ParametresUtilisateurSignature>;

export class ParametresUtilisateur extends RequestFunction<ParametresUtilisateurRequest> {
  public static readonly name = "ParametresUtilisateur";

  private readonly decoder = new ResponseFunction(
    this.session,
    ParametresUtilisateurModel,
    ParametresUtilisateurSignature
  );

  public constructor(session: Session) {
    super(session, ParametresUtilisateur.name);
  }

  public async send(): Promise<ParametresUtilisateurResponse> {
    const response = await this.execute({});
    return this.decoder.decode(response);
  }
}
