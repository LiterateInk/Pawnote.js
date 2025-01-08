import { RequestFN } from "~/core/request-function";
import { EntityState, TabLocation, type SessionHandle } from "~/models";
import { dataProperty } from "./private/data-property";

export const assignmentRemoveFile = async (session: SessionHandle, assignmentID: string): Promise<void> => {
  const request = new RequestFN(session, "SaisieTAFARendreEleve", {
    _Signature_: { onglet: TabLocation.Assignments },

    [dataProperty(session)]: {
      listeFichiers: [{
        E: EntityState.DELETION,
        TAF: { N: assignmentID }
      }]
    }
  });

  await request.send();
};
