import { RequestFN } from "~/core/request-function";
import { DoubleAuthServerAction, SessionHandle } from "~/models";
import { aesKeys } from "./private/keys";
import { AES } from "~/api/private/aes";
import { apiProperties } from "./private/api-properties";

export const securityCheckCustomPassword = async (session: SessionHandle, newPassword: string): Promise<boolean> => {
  const properties = apiProperties(session);
  const keys = aesKeys(session);

  const request = new RequestFN(session, "SecurisationCompteDoubleAuth", {
    [properties.data]: {
      action: DoubleAuthServerAction.csch_VerifierMotDePassePersonnalise,
      nouveauMDP: AES.encrypt(newPassword, keys.key, keys.iv)
    }
  });

  const response = await request.send();
  return response.data[properties.data].result;
};
