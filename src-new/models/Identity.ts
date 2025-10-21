import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { IdentificationResponse } from "../api/Identification";
import { BadCredentialsError } from "./Errors/BadCredentialsError";
import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { Session } from "./Session";

export class Identity {
  public constructor(
    public readonly identity: IdentificationResponse
  ) {}

  public createMiddlewareKey(username: string, mod: string): Uint8Array {
    try {
      if (this.identity.data.lowerUsername)
        username = username.toLowerCase();

      if (this.identity.data.lowerMod)
        mod = mod.toLowerCase();

      const hash = bytesToHex(sha256.create()
        .update(utf8ToBytes(this.identity.data.seed ?? ""))
        .update(utf8ToBytes(mod.trim()))
        .digest()).toUpperCase();

      return utf8ToBytes(username + hash);
    }
    catch {
      throw new BadCredentialsError();
    }
  }

  /**
   *
   * @param middlewareKey created with {@link createMiddlewareKey}
   */
  public solveChallenge(session: Session, middlewareKey: Uint8Array): Uint8Array {
    try {
      const pkey = session.aes.key;
      session.aes.key = middlewareKey; // temp switch key

      const encoded = bytesToUtf8(session.aes.decrypt(hexToBytes(this.identity.data.challenge)));
      const decoded = encoded.split("")
        .filter((_, i) => i % 2 === 0)
        .join("");

      const response = session.aes.encrypt(decoded);
      session.aes.key = pkey; // revert key
      return response;
    }
    catch {
      throw new BadCredentialsError();
    }
  }
}
