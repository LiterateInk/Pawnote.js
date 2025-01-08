import { RequestFN } from "~/core/request-function";
import { decodeAssignment } from "~/decoders/assignment";
import { TabLocation, type Assignment, type Resource, type SessionHandle } from "~/models";
import { dataProperty } from "./private/data-property";

/**
 * Retrieve assignments from a resource.
 */
export const resourceAssignments = async (session: SessionHandle, resourceID: string): Promise<Array<Assignment>> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "donneesContenusCDT", {
    _Signature_: { onglet: TabLocation.Resources },

    [property]: {
      pourTAF: true,
      cahierDeTextes: { N: resourceID }
    }
  });

  const response = await request.send();

  return response.data[property].ListeCahierDeTextes.V[0].ListeTravailAFaire.V
    .map((assignment: any) => decodeAssignment(assignment, session));
};
