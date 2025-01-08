import { type AccountKind, type RefreshInformation, type SessionHandle, BadCredentialsError, SecurityError } from "~/models";
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

export const loginCredentials = async (session: SessionHandle, auth: {
  url: string
  username: string
  password: string
  kind: AccountKind
  deviceUUID: string
  navigatorIdentifier?: string
}): Promise<RefreshInformation> => {
  const base = cleanURL(auth.url);

  session.information = await sessionInformation({
    base,
    kind: auth.kind,
    cookies: [], // none
    params: {
      ...BASE_PARAMS,
      // bypasss delegation
      bydlg: "A6ABB224-12DD-4E31-AD3E-8A39A1C2C335"
    }
  }, session.fetcher);

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

export const loginToken = async (session: SessionHandle, auth: {
  url: string
  username: string
  token: string
  kind: AccountKind
  deviceUUID: string
  navigatorIdentifier?: string
}): Promise<RefreshInformation> => {
  const base = cleanURL(auth.url);

  session.information = await sessionInformation({
    base,
    kind: auth.kind,
    cookies: ["appliMobile=1"],
    params: BASE_PARAMS
  }, session.fetcher);

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

  session.information = await sessionInformation({
    base: qr.url,
    kind: qr.kind,
    cookies: ["appliMobile=1"],
    params: BASE_PARAMS
  }, session.fetcher);

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

const switchToTokenLogin = (session: SessionHandle, auth: {
  token: string,
  username: string,
  deviceUUID: string
}): Promise<RefreshInformation> => {
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
 * @param identity
 * @param username Username to authenticate with.
 * @param mod Could be the password or the token.
 */
const createMiddlewareKey = (identity: any, username: string, mod: string) => {
  const hash = forge.md.sha256.create()
    .update(identity.alea ?? "")
    .update(forge.util.encodeUtf8(mod))
    .digest()
    .toHex()
    .toUpperCase();

  return forge.util.createBuffer(username + hash);
};

const transformCredentials = (auth: { username: string, token?: string, password?: string }, modProperty: "token" | "password", identity: any): void => {
  if (identity.modeCompLog === 1) {
    auth.username = auth.username.toLowerCase();
  }

  if (identity.modeCompMdp === 1) {
    auth[modProperty] = auth[modProperty]!.toLowerCase();
  }
};

/**
 * Resolve the authentication challenge.
 * Should be sent to the authenticate function.
 *
 * @param session Handle containing session information.
 * @param identity Response from `identify()` request.

 * @returns
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

const switchToAuthKey = (session: SessionHandle, authentication: any, key: forge.util.ByteStringBuffer): void => {
  const iv = forge.util.createBuffer(session.information.aesIV);
  const authKeyDecrypted = AES.decrypt(authentication.cle, key, iv);
  const authKey = authKeyDecrypted.split(",").map((char) => String.fromCharCode(parseInt(char))).join("");

  session.information.aesKey = authKey;
};

const hasSecurityModal = (authentication: any): boolean => Boolean(authentication.actionsDoubleAuth);

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
