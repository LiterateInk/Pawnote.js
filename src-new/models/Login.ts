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

export class Login {
  private session?: Session;

  public constructor (
    private readonly instance: Instance
  ) {}

  public async initializeWithStudentCrendentials(
    username: string,
    password: string,
    deviceUUID = crypto.randomUUID() as string,
    navigatorIdentifier: string | null = null
  ) {
    return this._initializeWithCredentials(Webspace.Students, username, password, deviceUUID, navigatorIdentifier);
  }

  private async _initializeWithCredentials(
    webspace: Webspace,
    username: string,
    password: string,
    deviceUUID: string,
    navigatorIdentifier: string | null
  ) {
    const instance = await this.instance.getInformation();
    const homepage = await this.getWebspaceHomepageSession(webspace);

    this.session = new Session(instance, homepage, this.instance.base);
    const parameters = new Parameters(
      await new FonctionParametres(this.session).send(navigatorIdentifier)
    );

    console.log(parameters);
  }

  private async getWebspaceHomepageSession(webspace: Webspace, cookies: Record<string, string> = {}): Promise<HomepageSession> {
    const params = new URLSearchParams();

    // 1. bypass browser restrictions
    params.set("fd", "1");

    // 2. bypass CAS, if enabled
    params.set("login", "true");

    // 3. bypass delegation (when `login=true` is disabled)
    params.set("bydlg", "A6ABB224-12DD-4E31-AD3E-8A39A1C2C335");
    const url = this.instance.base + "/" + Webspace.toMobilePath(webspace) + "?" + params.toString();

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
