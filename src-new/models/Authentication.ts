import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { AuthentificationResponse } from "../api/Authentification";
import { Session } from "./Session";
import { TypeActionIHMSecurisationCompte } from "../api/models/TypeActionIHMSecurisationCompte";
import { PasswordRules } from "./PasswordRules";
import { TypeModeGestionDoubleAuthentification } from "src-new/api/models/TypeModeGestionDoubleAuthentification";

export class Authentication {
  public readonly password: PasswordRules;
  public token: string;

  public constructor(
    private readonly _raw: AuthentificationResponse,
    public readonly username: string
  ) {
    this.password = new PasswordRules(_raw.data.passwordRules);
    this.token = _raw.data.token;
  }

  public get securityActions(): TypeActionIHMSecurisationCompte[] {
    return this._raw.data.securityActions ?? [];
  }

  public get hasSecurityActions(): boolean {
    return this.securityActions.length > 0;
  }

  public get modes(): TypeModeGestionDoubleAuthentification[] {
    return this._raw.data.availableSecurityModes ?? [];
  }

  public switchDefinitiveKey(session: Session, key: Uint8Array): void {
    session.aes.key = key; // temp switch key

    const decrypted = bytesToUtf8(session.aes.decrypt(hexToBytes(this._raw.data.key)));
    session.aes.key = new Uint8Array(
      decrypted.split(",").map(Number)
    );
  }
}
