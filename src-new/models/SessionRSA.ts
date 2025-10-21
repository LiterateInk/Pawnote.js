import type { HomepageSession } from "./HomepageSession";
import type { PublicKey } from "micro-rsa-dsa-dh/rsa.js";

export class SessionRSA {
  private static DEFAULT_RSA_MODULUS = 130337874517286041778445012253514395801341480334668979416920989365464528904618150245388048105865059387076357492684573172203245221386376405947824377827224846860699130638566643129067735803555082190977267155957271492183684665050351182476506458843580431717209261903043895605014125081521285387341454154194253026277n;
  private static DEFAULT_RSA_EXPONENT = 65537n;

  private modulus = SessionRSA.DEFAULT_RSA_MODULUS;
  private exponent = SessionRSA.DEFAULT_RSA_EXPONENT;

  /**
   * Whether the modulus and exponent are coming from
   * the webspace HTML homepage or not.
   */
  public readonly custom: boolean;

  public get publicKey(): PublicKey {
    return {
      n: this.modulus,
      e: this.exponent
    };
  }

  /** @internal */
  public constructor(session: HomepageSession) {
    if (session.rsaModulus) this.modulus = BigInt("0x" + session.rsaModulus);
    if (session.rsaExponent) this.exponent = BigInt("0x" + session.rsaExponent);

    this.custom = !!session.rsaExponent && !!session.rsaModulus;
  }
}
