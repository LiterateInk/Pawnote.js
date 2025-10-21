import { HeaderKeys, HttpRequest, HttpRequestRedirection, send } from "schwi";
import { Instance } from "./Instance";
import { Webspace } from "./Webspace";
import { UA } from "src-new/core/user-agent";
import { SuspendedIpError } from "./Errors/SuspendedIpError";
import { PageUnavailableError } from "./Errors/PageUnavailableError";
import { BusyPageError } from "./Errors/BusyPageError";
import { HomepageSession } from "./HomepageSession";
import { deserialize } from "desero";
import { Session } from "./Session";
import { FonctionParametres } from "src-new/api/FonctionParametres";
import { Parameters } from "./Parameters";
import { Identification, IdentificationMode } from "src-new/api/Identification";
import { Authentification } from "src-new/api/Authentification";
import { Identity } from "./Identity";
import { Authentication } from "./Authentication";
import { Student } from "./Student";

/**
 * An intermediate class where a user is half authenticated.
 *
 * Login portal might wait for additional data
 * such as PIN code or password change for example.
 */
class PendingLogin {
  public constructor(
    public readonly session: Session,
    public readonly parameters: Parameters,
    public readonly authentication: Authentication
  ) {}

  public get shouldCustomPassword(): boolean {
    return false;
  }
  public get shouldCustomDoubleAuth(): boolean {
    return false;
  }
  public get shouldEnterPIN(): boolean {
    return false;
  }
  public get shouldRegisterDevice(): boolean {
    return false;
  }
}

abstract class LoginPortal {
  protected constructor (
    protected readonly _instance: Instance
  ) {}

  protected async _credentials(
    webspace: Webspace,
    username: string,
    password: string,
    deviceUUID: string,
    navigatorIdentifier: string | null
  ): Promise<PendingLogin> {
    const instance = await this._instance.getInformation();
    const homepage = await this._getWebspaceHomepageSession(webspace);

    const session = new Session(instance, homepage, this._instance.base);

    const parameters = new Parameters(
      await new FonctionParametres(session).send(navigatorIdentifier)
    );

    const identity = new Identity(
      await new Identification(session).send(username, deviceUUID, IdentificationMode.Credentials)
    );

    const key = identity.createMiddlewareKey(username, password);
    const challenge = identity.solveChallenge(session, key);

    const authentication = new Authentication(
      await new Authentification(session).send(challenge)
    );

    authentication.switchDefinitiveKey(session, key);

    if (authentication.hasSecurityActions) {
      return this._token(
        webspace,
        username,
        authentication.token,
        deviceUUID,
        parameters.navigatorIdentifier
      );
    }

    return new PendingLogin(
      session,
      parameters,
      authentication
    );
  }

  protected async _token(
    webspace: Webspace,
    username: string,
    token: string,
    deviceUUID: string,
    navigatorIdentifier: string | null
  ): Promise<PendingLogin> {
    const instance = await this._instance.getInformation();
    const homepage = await this._getWebspaceHomepageSession(webspace, {
      appliMobile: "1"
    });

    const session = new Session(instance, homepage, this._instance.base);

    const parameters = new Parameters(
      await new FonctionParametres(session).send(navigatorIdentifier)
    );

    const identity = new Identity(
      await new Identification(session).send(username, deviceUUID, IdentificationMode.Token)
    );

    const key = identity.createMiddlewareKey(username, token);
    const challenge = identity.solveChallenge(session, key);

    const authentication = new Authentication(
      await new Authentification(session).send(challenge)
    );

    authentication.switchDefinitiveKey(session, key);

    return new PendingLogin(
      session,
      parameters,
      authentication
    );
  }

  /**
   * Sends the final payload.
   * @returns user parameters for the logged in user
   */
  protected async _finish(login: PendingLogin) {
    return "ok";
  }

  private async _getWebspaceHomepageSession(webspace: Webspace, cookies: Record<string, string> = {}): Promise<HomepageSession> {
    const params = new URLSearchParams();

    // 1. bypass browser restrictions
    params.set("fd", "1");

    // 2. bypass CAS, if enabled
    params.set("login", "true");

    // 3. bypass delegation (when `login=true` is disabled)
    params.set("bydlg", "A6ABB224-12DD-4E31-AD3E-8A39A1C2C335");
    const url = this._instance.base + "/" + Webspace.toMobilePath(webspace) + "?" + params.toString();

    // 4. retrieve the HTML from the homepage
    const request = new HttpRequest.Builder(url)
      .setRedirection(HttpRequestRedirection.MANUAL)
      .setHeader(HeaderKeys.USER_AGENT, UA)
      .setAllCookies(cookies)
      .build();

    const response = await send(request);
    let html = await response.toString();

    if (html.includes("Votre adresse IP est provisoirement suspendue")) {
      throw new SuspendedIpError();
    }
    else if (html.includes("Le site n'est pas disponible")) {
      throw new PageUnavailableError();
    }
    else if (html.includes("Le site est momentanément indisponible")) {
      throw new BusyPageError();
    }

    html = html.replace(/ /ug, "").replace(/\n/ug, "");

    const from = "Start(";
    const to = ")}catch";

    const arg = html.substring(
      html.indexOf(from) + from.length,
      html.indexOf(to)
    );

    const json = JSON.parse(arg
      .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/gu, "\"$2\": ")
      .replace(/'/gu, "\""));

    return deserialize(HomepageSession, json);
  }
}

export class StudentLoginPortal extends LoginPortal {
  public constructor (instance: Instance) {
    super(instance);
  }

  public async credentials(
    username: string,
    password: string,
    deviceUUID = crypto.randomUUID() as string,
    navigatorIdentifier: string | null = null
  ): Promise<PendingLogin> {
    return super._credentials(
      Webspace.Students,
      username,
      password,
      deviceUUID,
      navigatorIdentifier
    );
  }

  public async token(
    username: string,
    token: string,
    deviceUUID: string,
    navigatorIdentifier: string | null = null
  ): Promise<PendingLogin> {
    return super._token(
      Webspace.Students,
      username,
      token,
      deviceUUID,
      navigatorIdentifier
    );
  }

  public async finish(login: PendingLogin): Promise<Student> {
    const user = await super._finish(login);

    return new Student(
      login.session,
      login.parameters,
      login.authentication
    );
  }
}
