import { FonctionParametres } from "../../api/FonctionParametres";
import { Instance } from "../Instance";
import { Parameters } from "../Parameters";
import { PendingLogin } from "../PendingLogin";
import { Session } from "../Session";
import { Webspace } from "../Webspace";
import { Identity } from "../Identity";
import { Identification, IdentificationMode } from "../../api/Identification";
import { Authentication } from "../Authentication";
import { Authentification } from "../../api/Authentification";
import { UserParameters } from "../UserParameters";
import { SecurisationCompteDoubleAuth } from "../../api/SecurisationCompteDoubleAuth";
import { ParametresUtilisateur } from "../../api/ParametresUtilisateur";
import { HeaderKeys, HttpRequest, HttpRequestRedirection, send } from "schwi";
import { UA } from "../../core/user-agent";
import { SuspendedIpError } from "../Errors/SuspendedIpError";
import { PageUnavailableError } from "../Errors/PageUnavailableError";
import { BusyPageError } from "../Errors/BusyPageError";
import { deserialize } from "desero";
import { HomepageSession } from "../HomepageSession";

export abstract class LoginPortal {
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
      await new Authentification(session).send(challenge),
      identity.username ?? username
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
      await new Authentification(session).send(challenge),
      identity.username ?? username
    );

    authentication.switchDefinitiveKey(session, key);

    return new PendingLogin(
      session,
      parameters,
      authentication
    );
  }

  protected async _finish(login: PendingLogin): Promise<UserParameters> {
    if (login.shouldCustomDoubleAuth || login.shouldCustomPassword || login.shouldEnterPIN || login.shouldRegisterSource) {
      const token = await new SecurisationCompteDoubleAuth(login._session)
        .save(void 0, login._password, login._pin, login._source);

      if (token) login._authentication.token = token;
    }

    return new UserParameters(await new ParametresUtilisateur(login._session).send());
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
