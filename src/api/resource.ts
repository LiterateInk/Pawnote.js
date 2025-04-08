import { RequestFN } from "~/core/request-function";
import { decodeResource } from "~/decoders/resource";
import { TabLocation, type Resource, type SessionHandle } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Retrieve a specific resource by its ID.
 * @param {SessionHandle} session - The current session handle.
 * @param {string} resourceID - The ID of the resource to retrieve.
 * @returns {Promise<Resource>} A promise that resolves to the resource.
 */
export const resource = async (session: SessionHandle, resourceID: string): Promise<Resource> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "donneesContenusCDT", {
    [properties.signature]: { onglet: TabLocation.Resources },

    [properties.data]: {
      cahierDeTextes: { N: resourceID }
    }
  });

  const response = await request.send();

  const resource = response.data[properties.data].ListeCahierDeTextes.V[0];
  return decodeResource(resource, session);
};
