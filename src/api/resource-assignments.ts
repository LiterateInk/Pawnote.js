import { RequestFN } from "~/core/request-function";
import { decodeAssignment } from "~/decoders/assignment";
import { TabLocation, type Assignment, type Resource, type SessionHandle } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Retrieve assignments from a resource.
 */
export const resourceAssignments = async (session: SessionHandle, resourceID: string): Promise<Array<Assignment>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "donneesContenusCDT", {
    [properties.signature]: { onglet: TabLocation.Resources },

    [properties.data]: {
      pourTAF: true,
      cahierDeTextes: { N: resourceID }
    }
  });

  const response = await request.send();

  return response.data[properties.data].ListeCahierDeTextes.V[0].ListeTravailAFaire.V
    .map((assignment: any) => decodeAssignment(assignment, session));
};
