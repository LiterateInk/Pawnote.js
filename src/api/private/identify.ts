import { RequestFN } from "~/core/request-function";
import type { SessionHandle } from "~/models";
import { dataProperty } from "./data-property";

export const identify = async (session: SessionHandle, parameters: {
  requestFirstMobileAuthentication: boolean,
  reuseMobileAuthentication: boolean,
  requestFromQRCode: boolean,
  useCAS: boolean

  username: string
  deviceUUID: string
}): Promise<any> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "Identification", {
    [property]: {
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
  return response.data[property];
};
