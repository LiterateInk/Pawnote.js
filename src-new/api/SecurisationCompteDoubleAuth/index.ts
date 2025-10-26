import { Session } from "src-new/models";
import { RequestFunction } from "src-new/models/RequestFunction";
import { ResponseFunction, ResponseFunctionWrapper } from "src-new/models/ResponseFunction";
import { SecurisationCompteDoubleAuthModel } from "./response";
import { SecurisationCompteDoubleAuthRequest } from "./request";
import { TypeCommandeSecurisationCompteHttp } from "../models/TypeCommandeSecurisationCompteHttp";
import { bytesToHex } from "@noble/ciphers/utils.js";
import { TypeModeGestionDoubleAuthentification } from "../models/TypeModeGestionDoubleAuthentification";

export type SecurisationCompteDoubleAuthResponse = ResponseFunctionWrapper<SecurisationCompteDoubleAuthModel>;

export class SecurisationCompteDoubleAuth extends RequestFunction<SecurisationCompteDoubleAuthRequest> {
  public static readonly name = "SecurisationCompteDoubleAuth";

  private readonly decoder = new ResponseFunction(
    this.session,
    SecurisationCompteDoubleAuthModel
  );

  public constructor(session: Session) {
    super(session, SecurisationCompteDoubleAuth.name);
  }

  public async sendPasswordCheck (password: string): Promise<boolean> {
    const response = await this.execute({
      action: TypeCommandeSecurisationCompteHttp.csch_VerifierMotDePassePersonnalise,
      nouveauMDP: bytesToHex(this.session.aes.encrypt(password))
    });

    const { data } = await this.decoder.decode(response);
    return data.ok === true;
  }

  public async sendPinVerify (pin: string): Promise<boolean> {
    const response = await this.execute({
      action: TypeCommandeSecurisationCompteHttp.csch_VerifierPIN,
      codePin: bytesToHex(this.session.aes.encrypt(pin))
    });

    const { data } = await this.decoder.decode(response);
    return data.ok === true;
  }

  public async sendSourceAlreadyKnown (source: string): Promise<boolean> {
    const response = await this.execute({
      action: TypeCommandeSecurisationCompteHttp.csch_LibellesSourceConnexionDejaConnus,
      libelle: source
    });

    const { data } = await this.decoder.decode(response);
    return data.alreadyKnown === true;
  }

  public async save(mode?: TypeModeGestionDoubleAuthentification, password?: string, pin?: string, source?: string): Promise<string | null> {
    const payload: SecurisationCompteDoubleAuthRequest = {
      action: TypeCommandeSecurisationCompteHttp.csch_EnregistrerChoixUtilisateur,
      mode
    };

    if (password) {
      payload.nouveauMDP = bytesToHex(this.session.aes.encrypt(password));
    }

    if (pin) {
      payload.codePin = bytesToHex(this.session.aes.encrypt(pin));
    }

    if (source) {
      payload.avecIdentification = true;
      payload.strIdentification = source;
    }

    const response = await this.execute(payload);
    const { data } = await this.decoder.decode(response);
    return data.token;
  }
}
