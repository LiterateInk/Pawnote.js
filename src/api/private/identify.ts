import { RequestFN } from "~/core/request-function";
import type { SessionHandle } from "~/models";
import { apiProperties } from "./api-properties";

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
      genreConnexion: 0, // NOTE: Probably the `accessKind` property, not sure though.
      genreEspace: session.information.accountKind,
      identifiant: parameters.username,
      pourENT: parameters.useCAS,
      enConnexionAuto: false,
      enConnexionAppliMobile: parameters.reuseMobileAuthentication,
      demandeConnexionAuto: false,
      demandeConnexionAppliMobile: parameters.requestFirstMobileAuthentication,
      demandeConnexionAppliMobileJeton: parameters.requestFromQRCode,
      uuidAppliMobile: parameters.deviceUUID,
      loginTokenSAV: ""
    }
  });

  const response = await request.send();
  return response.data[properties.data];
};
