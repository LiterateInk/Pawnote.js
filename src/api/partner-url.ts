import { RequestFN } from "~/core/request-function";
import { type Partner, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

export const partnerURL = async (session: SessionHandle, partner: Partner): Promise<string> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisieURLPartenaire", {
    [properties.signature]: { onglet: TabLocation.Presence },

    [properties.data]: {
      SSO: partner.sso
    }
  });

  const response = await request.send();
  return response.data.RapportSaisie.urlSSO.V;
};
