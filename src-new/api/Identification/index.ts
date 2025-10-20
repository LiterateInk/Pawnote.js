import { ResponseFunction, ResponseFunctionWrapper } from "src-new/models/ResponseFunction";
import { RequestFunction } from "../../models/RequestFunction";
import { Session } from "src-new/models";
import { IdentificationRequest } from "./request";
import { IdentificationModel } from "./response";

export type IdentificationResponse = ResponseFunctionWrapper<IdentificationModel>;

export class Identification extends RequestFunction<IdentificationRequest> {
  private static readonly name = "Identification";

  private readonly decoder = new ResponseFunction(
    this.session,
    IdentificationModel
  );

  public constructor(session: Session) {
    super(session, Identification.name);
  }

  public async send(
    username: string,
    uuid: string,
    token = false,
    cas = false,
    qr = false
  ): Promise<IdentificationResponse> {
    const response = await this.execute({
      genreConnexion: 0,
      genreEspace: this.session.homepage.webspace,
      identifiant: username,
      pourENT: cas,
      enConnexionAuto: false,
      demandeConnexionAuto: false,
      enConnexionAppliMobile: token,
      demandeConnexionAppliMobile: !token,
      demandeConnexionAppliMobileJeton: qr,
      uuidAppliMobile: uuid,
      loginTokenSAV: "",
      // Let's keep values coherent with our `User-Agent` header value.
      informationsAppareil: {
        // device.model @ https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html#devicemodel
        //              @ https://www.theiphonewiki.com/wiki/Models
        modele: "iPhone18,3", // iPhone 17
        // device.platform @ https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html#deviceplatform
        platforme: "iOS"
      }
    });

    return this.decoder.decode(response);
  }
}
