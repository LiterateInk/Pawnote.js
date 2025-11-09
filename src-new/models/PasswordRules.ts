import { ReglesSaisieMDP } from "~/api/Authentification/response";
import { TypeOptionGenerationMotDePasse } from "~/api/models/TypeOptionGenerationMotDePasse";

/**
 * Password rules when the user must change it, either manually or required.
 */
export class PasswordRules {
  /**
   * Must contain at least {@link min} characters.
   */
  public readonly min: number;

  /**
   * Must contain between {@link min} and {@link max} characters.
   */
  public readonly max: number;

  /**
   * Must contain at least one letter.
   */
  public readonly withAtLeastOneLetter: boolean;

  /**
   * Must contain at least one numeric character.
   */
  public readonly withAtLeastOneNumericCharacter: boolean;

  /**
   * Must contain at least one special character, neither number nor letter.
   */
  public readonly withAtLeastOneSpecialCharacter: boolean;

  /**
   * Must mix upper and lower case letters.
   */
  public readonly withLowerAndUpperCaseMixed: boolean;

  /** @internal */
  public constructor(_raw: ReglesSaisieMDP) {
    this.min = _raw.min;
    this.max = _raw.max;

    this.withAtLeastOneLetter = _raw.options.includes(
      TypeOptionGenerationMotDePasse.OGMDP_AvecAuMoinsUnChiffre
    );

    this.withAtLeastOneNumericCharacter = _raw.options.includes(
      TypeOptionGenerationMotDePasse.OGMDP_AvecAuMoinsUnChiffre
    );

    this.withAtLeastOneSpecialCharacter = _raw.options.includes(
      TypeOptionGenerationMotDePasse.OGMDP_AvecAuMoinsUnCaractereSpecial
    );

    this.withLowerAndUpperCaseMixed = _raw.options.includes(
      TypeOptionGenerationMotDePasse.OGMDP_AvecMelangeMinusculeMajuscule
    );
  }
}
