import { type RefreshInformation, type SessionHandle, BadCredentialsError, SecurityError, type PasswordAuthenticationParams, type TokenAuthenticationParams, InstanceParameters } from "~/models";
import { sessionInformation } from "../session-information";
import { instanceParameters } from "../private/instance-parameters";
import { cleanURL } from "./clean-url";
import { identify } from "../private/identify";
import forge from "node-forge";
import { AES } from "../private/aes";
import { authenticate } from "../private/authenticate";
import { userParameters } from "../private/user-parameters";
import { decodeAuthenticationQr } from "~/decoders/authentication-qr";
import { use } from "./use";

/**
 * base parameters for `sessionInformation` call.
 */
const BASE_PARAMS = {
  /** bypass the user-agent restriction */
  fd: 1,
  /** bypass the CAS if setup */
  login: true
};

/**
 * Logs in using user credentials.
 *
 * @param session - The current session handle.
 * @param auth - The authentication details including URL, username, password, account kind, device UUID, and optional navigator identifier.
 * @returns A promise resolving to the refreshed session information.
 */
export const loginCredentials = async (session: SessionHandle, auth: PasswordAuthenticationParams): Promise<RefreshInformation> => {
  const base = cleanURL(auth.url);

  const { information, version } = await sessionInformation({
    base,
    kind: auth.kind,
    cookies: [], // none
    params: {
      ...BASE_PARAMS,
      // bypasss delegation
      bydlg: "A6ABB224-12DD-4E31-AD3E-8A39A1C2C335"
    }
  }, session.fetcher);

  session.information = information;
  session.instance = <InstanceParameters>{ version };
  session.instance = await instanceParameters(session, auth.navigatorIdentifier);

  const identity = await identify(session, {
    username: auth.username,
    deviceUUID: auth.deviceUUID,

    requestFirstMobileAuthentication: true,
    reuseMobileAuthentication: false,
    requestFromQRCode: false,
    useCAS: false
  });

  transformCredentials(auth, "password", identity);
  const key = createMiddlewareKey(identity, auth.username, auth.password);

  const challenge = solveChallenge(session, identity, key);
  const authentication = await authenticate(session, challenge);
  switchToAuthKey(session, authentication, key);

  if (hasSecurityModal(authentication)) {
    return switchToTokenLogin(session, {
      token: authentication.jetonConnexionAppliMobile,
      username: identity.login ?? auth.username,
      deviceUUID: auth.deviceUUID
    });
  }
  else return finishLoginManually(session, authentication, identity, auth.username);
};

/**
 * Logs in using a token.
 *
 * @param session - The current session handle.
 * @param auth - The authentication details including URL, username, token, account kind, device UUID, and optional navigator identifier.
 * @returns A promise resolving to the refreshed session information.
 */
export const loginToken = async (session: SessionHandle, auth: TokenAuthenticationParams): Promise<RefreshInformation> => {
  const base = cleanURL(auth.url);

  const { information, version } = await sessionInformation({
    base,
    kind: auth.kind,
    cookies: ["appliMobile=1"],
    params: BASE_PARAMS
  }, session.fetcher);

  session.information = information;
  session.instance = <InstanceParameters>{ version };
  session.instance = await instanceParameters(session, auth.navigatorIdentifier);

  const identity = await identify(session, {
    username: auth.username,
    deviceUUID: auth.deviceUUID,

    requestFirstMobileAuthentication: false,
    reuseMobileAuthentication: true,
    requestFromQRCode: false,
    useCAS: false
  });

  transformCredentials(auth, "token", identity);
  const key = createMiddlewareKey(identity, auth.username, auth.token);

  const challenge = solveChallenge(session, identity, key);
  const authentication = await authenticate(session, challenge);
  switchToAuthKey(session, authentication, key);

  if (hasSecurityModal(authentication)) {
    throw new SecurityError(authentication, identity, auth.username);
  }

  return finishLoginManually(session, authentication, identity, auth.username);
};

/**
 * Logs in using a QR code.
 *
 * @param session - The current session handle.
 * @param info - The authentication information including device UUID, PIN, QR code data, and optional navigator identifier.
 * @returns A promise resolving to the refreshed session information.
 */
export const loginQrCode = async (session: SessionHandle, info: {
  deviceUUID: string
  pin: string
  qr: any
  navigatorIdentifier?: string
}): Promise<RefreshInformation> => {
  const qr = decodeAuthenticationQr(info.qr);
  const pin = forge.util.createBuffer(info.pin);

  const read = (prop: "token" | "username") => AES.decrypt(forge.util.encodeUtf8(qr[prop]), pin, forge.util.createBuffer());

  const auth = {
    username: read("username"),
    token: read("token")
  };

  const { information, version } = await sessionInformation({
    base: qr.url,
    kind: qr.kind,
    cookies: ["appliMobile=1"],
    params: BASE_PARAMS
  }, session.fetcher);

  session.information = information;
  session.instance = <InstanceParameters>{ version };
  session.instance = await instanceParameters(session, info.navigatorIdentifier);

  const identity = await identify(session, {
    username: auth.username,
    deviceUUID: info.deviceUUID,

    requestFirstMobileAuthentication: true,
    reuseMobileAuthentication: false,
    requestFromQRCode: true,
    useCAS: false
  });

  transformCredentials(auth, "token", identity);
  const key = createMiddlewareKey(identity, auth.username, auth.token);

  const challenge = solveChallenge(session, identity, key);
  const authentication = await authenticate(session, challenge);
  switchToAuthKey(session, authentication, key);

  if (hasSecurityModal(authentication)) {
    return switchToTokenLogin(session, {
      token: authentication.jetonConnexionAppliMobile,
      username: identity.login ?? auth.username,
      deviceUUID: info.deviceUUID
    });
  }
  else return finishLoginManually(session, authentication, identity, auth.username);
};

/**
 * Switches the session to token-based login.
 *
 * @param session - The current session handle.
 * @param auth - The authentication details including token, username, and device UUID.
 * @returns A promise resolving to the refreshed session information.
 */
const switchToTokenLogin = (session: SessionHandle, auth: Pick<TokenAuthenticationParams, "token" | "username" | "deviceUUID">): Promise<RefreshInformation> => {
  // TODO: Add and call logout function for current `session`.

  return loginToken(session, {
    url: session.information.url,
    kind: session.information.accountKind,
    username: auth.username,
    token: auth.token,
    deviceUUID: auth.deviceUUID,
    navigatorIdentifier: session.instance.navigatorIdentifier
  });
};

/**
 * Creates a middleware key for authentication.
 *
 * @param identity - The identity object returned from the `identify()` function.
 * @param username - The username to authenticate with.
 * @param mod - The password or token used for authentication.
 * @returns A buffer containing the middleware key.
 */
const createMiddlewareKey = (identity: any, username: string, mod: string): forge.util.ByteStringBuffer => {
  const hash = forge.md.sha256.create()
    .update(identity.alea ?? "")
    .update(forge.util.encodeUtf8(mod))
    .digest()
    .toHex()
    .toUpperCase();

  return forge.util.createBuffer(username + hash);
};

/**
 * Transforms the credentials based on the identity's compatibility modes.
 *
 * @param auth - The authentication object containing username, token, or password.
 * @param modProperty - The property to modify, either "token" or "password".
 * @param identity - The identity object returned from the `identify()` function.
 */
const transformCredentials = (auth: { username: string, token?: string, password?: string }, modProperty: "token" | "password", identity: any): void => {
  if (identity.modeCompLog === 1) {
    auth.username = auth.username.toLowerCase();
  }

  if (identity.modeCompMdp === 1) {
    auth[modProperty] = auth[modProperty]!.toLowerCase();
  }
};

/**
 * Resolves the authentication challenge.
 *
 * @param session - The current session handle containing session information.
 * @param identity - The identity object returned from the `identify()` function.
 * @param key - The middleware key used for decryption.
 * @returns The encrypted solution to the challenge.
 * @throws `BadCredentialsError` if the challenge cannot be solved.
 */
const solveChallenge = (session: SessionHandle, identity: any, key: forge.util.ByteStringBuffer): string => {
  const iv = forge.util.createBuffer(session.information.aesIV);

  try {
    const bytes = forge.util.decodeUtf8(AES.decrypt(identity.challenge, key, iv));

    // Modify the plain text by removing every second character.
    const unscrambled = new Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 1) {
      if (i % 2 === 0) {
        unscrambled.push(bytes.charAt(i));
      }
    }

    const solution = forge.util.encodeUtf8(unscrambled.join(""));
    return AES.encrypt(solution, key, iv);
  }
  catch {
    throw new BadCredentialsError();
  }
};

/**
 * Switches the session to use the authentication key.
 *
 * @param session - The current session handle containing session information.
 * @param authentication - The authentication object returned from the `authenticate()` function.
 * @param key - The middleware key used for decryption.
 * @returns {void}
 */
const switchToAuthKey = (session: SessionHandle, authentication: any, key: forge.util.ByteStringBuffer): void => {
  const iv = forge.util.createBuffer(session.information.aesIV);
  const authKeyDecrypted = AES.decrypt(authentication.cle, key, iv);
  const authKey = authKeyDecrypted.split(",").map((char) => String.fromCharCode(parseInt(char))).join("");

  session.information.aesKey = authKey;
};

/**
 * Checks if the authentication response contains a security modal.
 *
 * @param authentication - The authentication object returned from the `authenticate()` function.
 * @returns `true` if a security modal is present, otherwise `false`.
 */
const hasSecurityModal = (authentication: any): boolean => Boolean(authentication.actionsDoubleAuth);

/**
 * Completes the login process manually.
 *
 * @param session - The current session handle.
 * @param authentication - The authentication object returned from the `authenticate()` function.
 * @param identity - The identity object returned from the `identify()` function.
 * @param [initialUsername] - The initial username used for login.
 * @returns A promise resolving to the refreshed session information.
 */
export const finishLoginManually = async (session: SessionHandle, authentication: any, identity: any, initialUsername?: string): Promise<RefreshInformation> => {
  session.user = await userParameters(session);
  use(session, 0); // default to first resource.

  return {
    token: authentication.jetonConnexionAppliMobile,
    username: identity.login ?? initialUsername,
    kind: session.information.accountKind,
    url: session.information.url,
    navigatorIdentifier: session.instance.navigatorIdentifier
  };
};
