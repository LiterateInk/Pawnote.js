import { RequestFN } from "~/core/request-function";
import { EntityState, SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

export const assignmentStatus = async (session: SessionHandle, assignmentID: string, done: boolean): Promise<void> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisieTAFFaitEleve", {
    [properties.signature]: { onglet: TabLocation.Assignments },

    [properties.data]: {
      listeTAF: [{
        E: EntityState.MODIFICATION,
        TAFFait: done,
        N: assignmentID
      }]
    }
  });

  await request.send();
};
