import { RequestFN } from "~/core/request-function";
import { EntityState, TabLocation, type SessionHandle } from "~/models";
import { apiProperties } from "./private/api-properties";

export const assignmentRemoveFile = async (session: SessionHandle, assignmentID: string): Promise<void> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisieTAFARendreEleve", {
    [properties.signature]: { onglet: TabLocation.Assignments },

    [properties.data]: {
      listeFichiers: [{
        E: EntityState.DELETION,
        TAF: { N: assignmentID }
      }]
    }
  });

  await request.send();
};
