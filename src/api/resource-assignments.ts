import { RequestFN } from "~/core/request-function";
import { decodeAssignment } from "~/decoders/assignment";
import { TabLocation, type Assignment, type SessionHandle } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Retrieve assignments from a resource.
 * @param session - The current session handle.
 * @param resourceID - The ID of the resource.
 * @returns A promise that resolves to an array of assignments.
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
