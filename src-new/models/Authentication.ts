import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { AuthentificationResponse } from "../api/Authentification";
import { Session } from "./Session";

export class Authentication {
  public constructor(
    private readonly authentication: AuthentificationResponse
  ) {}

  public get token(): string {
    return this.authentication.data.token;
  }

  public get hasSecurityActions(): boolean {
    return Boolean(this.authentication.data.actionsDoubleAuth);
  }

  public switchDefinitiveKey(session: Session, key: Uint8Array): void {
    session.aes.key = key; // temp switch key

    const decrypted = bytesToUtf8(session.aes.decrypt(hexToBytes(this.authentication.data.key)));
    session.aes.key = new Uint8Array(
      decrypted.split(",").map(Number)
    );
  }
}
