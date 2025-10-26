import { SecurisationCompteDoubleAuth } from "../api/SecurisationCompteDoubleAuth";
import { TypeActionIHMSecurisationCompte } from "../api/models/TypeActionIHMSecurisationCompte";
import { Authentication } from "./Authentication";
import { SourceTooLongError } from "./Errors/SourceTooLongError";
import { Parameters } from "./Parameters";
import { PasswordRules } from "./PasswordRules";
import { Session } from "./Session";

/**
 * An intermediate class where a user is half authenticated.
 *
 * Login portal might wait for additional data
 * such as PIN code or password change for example.
 */
export class PendingLogin {
  /** @internal */
  public constructor(
    /** @internal */
    public readonly _session: Session,
    /** @internal */
    public readonly _parameters: Parameters,
    /** @internal */
    public readonly _authentication: Authentication
  ) {}

  public get shouldCustomPassword(): boolean {
    return this._authentication.securityActions.includes(
      TypeActionIHMSecurisationCompte.AIHMSC_PersonnalisationMotDePasse
    );
  }
  public get shouldCustomDoubleAuth(): boolean {
    return this._authentication.securityActions.includes(
      TypeActionIHMSecurisationCompte.AIHMSC_ChoixStrategie
    );
  }
  public get shouldEnterPIN(): boolean {
    return this._authentication.securityActions.includes(
      TypeActionIHMSecurisationCompte.AIHMSC_SaisieCodePINetSource
    );
  }
  public get shouldRegisterSource(): boolean {
    return this._authentication.securityActions.includes(
      TypeActionIHMSecurisationCompte.AIHMSC_SaisieSourcePourNotifSeulement
    );
  }

  /**
   * If you have to custom the password, this property
   * gives you all the rules you have to respect in
   * order to create a new password.
   */
  public get password(): PasswordRules {
    return this._authentication.password;
  }

  /** @internal */
  public _password?: string;

  /**
   * Checks a given password against the password
   * rules defined in the server configuration.
   *
   * Will let you know if you can change your password
   * to this or not.
   *
   * @param password - the password to check against the server rules
   * @returns whether the given password is allowed or not
   */
  public async validate(password: string): Promise<boolean> {
    const ok = await new SecurisationCompteDoubleAuth(this._session)
      .sendPasswordCheck(password);

    if (ok) this._password = password;
    return ok;
  }

  /** @internal */
  public _pin?: string;

  /**
   * Verify a given PIN code.
   *
   * @param pin - the pin code to check
   * @returns whether the pin code is correct or not
   */
  public async verify(pin: string): Promise<boolean> {
    const ok = await new SecurisationCompteDoubleAuth(this._session)
      .sendPinVerify(pin);

    if (ok) this._pin = pin;
    return ok;
  }

  /** @internal */
  public _source?: string;

  /**
   * Checks a given source to know if it is already known.
   * If yes, then it'll skip the registration at save time.
   *
   * @param source - the source to check, should be <=30 characters
   * @returns whether the source is already known
   */
  public async source(source: string): Promise<boolean> {
    if (source.length > 30)
      throw new SourceTooLongError(30);

    this._source = source;

    return new SecurisationCompteDoubleAuth(this._session)
      .sendSourceAlreadyKnown(source);
  }
}
