import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { AuthentificationResponse } from "../api/Authentification";
import { Session } from "./Session";
import { TypeActionIHMSecurisationCompte } from "../api/models/TypeActionIHMSecurisationCompte";
import { PasswordRules } from "./PasswordRules";
import { TypeModeGestionDoubleAuthentification } from "~/api/models/TypeModeGestionDoubleAuthentification";

export class Authentication {
  public readonly password: PasswordRules;
  public token: string;

  public constructor(
    private readonly auth: AuthentificationResponse,
    public readonly username: string,
    public readonly uuid: string
  ) {
    this.password = new PasswordRules(auth.data.passwordRules);
    this.token = auth.data.token;
  }

  public get securityActions(): TypeActionIHMSecurisationCompte[] {
    return this.auth.data.securityActions ?? [];
  }

  public get hasSecurityActions(): boolean {
    return this.securityActions.length > 0;
  }

  public get modes(): TypeModeGestionDoubleAuthentification[] {
    return this.auth.data.availableSecurityModes ?? [];
  }

  public switchDefinitiveKey(session: Session, key: Uint8Array): void {
    session.aes.key = key; // temp switch key

    const decrypted = bytesToUtf8(session.aes.decrypt(hexToBytes(this.auth.data.key)));
    session.aes.key = new Uint8Array(
      decrypted.split(",").map(Number)
    );
  }
}
