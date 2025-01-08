import { RequestFN } from "~/core/request-function";
import { DoubleAuthMode, DoubleAuthServerAction, SecurityModal, type SessionHandle } from "~/models";
import { aesKeys } from "./private/keys";
import { AES } from "./private/aes";
import { dataProperty } from "./private/data-property";

export const securitySave = async (session: SessionHandle, handle: SecurityModal, options: {
  password?: string,
  deviceName?: string,
  pin?: string,
  mode?: DoubleAuthMode
}): Promise<void> => {
  const data: any = {
    action: DoubleAuthServerAction.csch_EnregistrerChoixUtilisateur
  };

  const keys = aesKeys(session);

  if (typeof options.mode === "number") {
    data.mode = options.mode;
  }

  if (options.password) {
    data.nouveauMDP = AES.encrypt(options.password, keys.key, keys.iv);
  }

  if (options.pin) {
    data.codePin = AES.encrypt(options.pin, keys.key, keys.iv);
  }

  if (options.deviceName) {
    data.avecIdentification = true;
    data.strIdentification = options.deviceName;
  }

  const property = dataProperty(session);

  const request = new RequestFN(session, "SecurisationCompteDoubleAuth", {
    [property]: data
  });

  const response = await request.send();
  const token = response.data[property].jetonConnexionAppliMobile;

  if (token) { // update the token to use for refresh information generation
    handle.context.authentication.jetonConnexionAppliMobile = token;
  }
};
