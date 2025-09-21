import { RequestFN } from "~/core/request-function";
import type { SessionHandle } from "~/models";
import { apiProperties } from "./api-properties";
import { LoginKind } from "~/models/login-kind";

export const identify = async (session: SessionHandle, parameters: {
  requestFirstMobileAuthentication: boolean,
  reuseMobileAuthentication: boolean,
  requestFromQRCode: boolean,
  useCAS: boolean

  username: string
  deviceUUID: string
}): Promise<any> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "Identification", {
    [properties.data]: {
      genreConnexion: LoginKind.Normal, // NOTE: only teachers can have a different one, apparently!
      genreEspace: session.information.accountKind,
      identifiant: parameters.username,
      pourENT: parameters.useCAS,
      enConnexionAuto: false,
      demandeConnexionAuto: false,
      enConnexionAppliMobile: parameters.reuseMobileAuthentication,
      demandeConnexionAppliMobile: parameters.requestFirstMobileAuthentication,
      demandeConnexionAppliMobileJeton: parameters.requestFromQRCode,
      uuidAppliMobile: parameters.deviceUUID,
      loginTokenSAV: "",

      // Let's keep values coherent with our `User-Agent` header value.
      informationsAppareil: {
        // device.model @ https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html#devicemodel
        //              @ https://www.theiphonewiki.com/wiki/Models
        modele: "iPhone18,3", // iPhone 17
        // device.platform @ https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html#deviceplatform
        platforme: "iOS"
      }
    }
  });

  const response = await request.send();
  return response.data[properties.data];
};
