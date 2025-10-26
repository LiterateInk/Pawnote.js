import type { TypeCommandeSecurisationCompteHttp } from "../models/TypeCommandeSecurisationCompteHttp";
import { TypeModeGestionDoubleAuthentification } from "../models/TypeModeGestionDoubleAuthentification";

export interface SecurisationCompteDoubleAuthRequest {
  action: TypeCommandeSecurisationCompteHttp;

  /**
   * - `csch_LibellesSourceConnexionDejaConnus` (required)
   */
  libelle?: string

  /**
   * - `csch_VerifierMotDePassePersonnalise` (required)
   * - `csch_EnregistrerChoixUtilisateur` (optional)
   *
   * Wrapped in `getChaineChiffreeAES()`
   */
  nouveauMDP?: string

  /**
   * - `csch_VerifierPIN` (required)
   * - `csch_VerifierCodeReinitialisationPIN` (required)
   * - `csch_EnregistrerChoixUtilisateur` (optional)
   *
   * Wrapped in `getChaineChiffreeAES()`
   */
  codePin?: string

  /**
   * - `csch_EnregistrerChoixUtilisateur` (optional)
   */
  reinitPIN_OK?: boolean

  /**
   * Required once `reinitPIN_OK` is set to `true`.
   *
   * - `csch_EnregistrerChoixUtilisateur` (optional)
   *
   * Wrapped in `getChaineChiffreeAES()`
   */
  codePINVerifReinit?: string

  /**
   * - `csch_EnregistrerChoixUtilisateur` (optional)
   */
  mode?: TypeModeGestionDoubleAuthentification

  /**
   * - `csch_EnregistrerChoixUtilisateur` (required)
   */
  avecIdentification?: boolean

  /**
   * - `csch_EnregistrerChoixUtilisateur` (required, if `avecIdentification` is `true`)
   */
  strIdentification?: string
}
