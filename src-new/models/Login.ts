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
import { Identification } from "src-new/api/Identification";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { Authentification } from "src-new/api/Authentification";
import { BadCredentialsError } from "./Errors/BadCredentialsError";

abstract class Login {
  private _session?: Session;
  public requires2FA = false;

  protected constructor (
    protected readonly _instance: Instance
  ) {}

  protected async _initializeWithCredentials(
    webspace: Webspace,
    username: string,
    password: string,
    deviceUUID: string,
    navigatorIdentifier: string | null
  ): Promise<void> {
    const instance = await this._instance.getInformation();
    const homepage = await this._getWebspaceHomepageSession(webspace);

    this._session = new Session(instance, homepage, this._instance.base);
    const parameters = new Parameters(
      await new FonctionParametres(this._session).send(navigatorIdentifier)
    );

    const { data: identity } = await new Identification(this._session).send(username, deviceUUID);

    if (identity.lowerUsername) username = username.toLowerCase();
    if (identity.lowerPassword) password = password.toLowerCase();

    const key = this._createMiddlewareKey(identity.seed, username, password);
    const challenge = this._solveChallenge(identity.challenge, key);
    const { data: authentication } = await new Authentification(this._session).send(challenge);

    this._switchDefinitiveKey(key, authentication.key);
    this.requires2FA = Boolean(authentication.actionsDoubleAuth);
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

  private _createMiddlewareKey(seed: string | null, username: string, mod: string): Uint8Array {
    try {
      const hash = bytesToHex(sha256.create()
        .update(utf8ToBytes(seed ?? ""))
        .update(utf8ToBytes(mod))
        .digest()).toUpperCase();

      return utf8ToBytes(username + hash);
    }
    catch {
      throw new BadCredentialsError();
    }
  }

  private _solveChallenge(challenge: string, key: Uint8Array): Uint8Array {
    try {
      const pkey = this._session!.aes.key;
      this._session!.aes.key = key; // temp switch key

      const encoded = bytesToUtf8(this._session!.aes.decrypt(hexToBytes(challenge)));
      const decoded = encoded.split("")
        .filter((_, i) => i % 2 === 0)
        .join("");

      const response = this._session!.aes.encrypt(decoded);
      this._session!.aes.key = pkey; // revert key
      return response;
    }
    catch {
      throw new BadCredentialsError();
    }
  }

  private _switchDefinitiveKey(key: Uint8Array, authKey: string): void {
    this._session!.aes.key = key; // temp switch key

    const decrypted = bytesToUtf8(this._session!.aes.decrypt(hexToBytes(authKey)));
    this._session!.aes.key = new Uint8Array(
      decrypted.split(",").map(Number)
    );
  }
}

export class StudentLogin extends Login {
  public constructor (instance: Instance) {
    super(instance);
  }

  public async initializeWithCredentials(
    username: string,
    password: string,
    deviceUUID = crypto.randomUUID() as string,
    navigatorIdentifier: string | null = null
  ): Promise<void> {
    return this._initializeWithCredentials(
      Webspace.Students,
      username,
      password,
      deviceUUID,
      navigatorIdentifier
    );
  }
}
