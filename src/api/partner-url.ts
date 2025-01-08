import { RequestFN } from "~/core/request-function";
import { type Partner, type SessionHandle, TabLocation } from "~/models";
import { dataProperty } from "./private/data-property";

export const partnerURL = async (session: SessionHandle, partner: Partner): Promise<string> => {
  const request = new RequestFN(session, "SaisieURLPartenaire", {
    _Signature_: { onglet: TabLocation.Presence },

    [dataProperty(session)]: {
      SSO: partner.sso
    }
  });

  const response = await request.send();
  return response.data.RapportSaisie.urlSSO.V;
};
