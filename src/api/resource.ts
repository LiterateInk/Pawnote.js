import { RequestFN } from "~/core/request-function";
import { decodeResource } from "~/decoders/resource";
import { TabLocation, type Resource, type SessionHandle } from "~/models";
import { dataProperty } from "./private/data-property";

export const resource = async (session: SessionHandle, resourceID: string): Promise<Resource> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "donneesContenusCDT", {
    _Signature_: { onglet: TabLocation.Resources },

    [property]: {
      cahierDeTextes: { N: resourceID }
    }
  });

  const response = await request.send();

  const resource = response.data[property].ListeCahierDeTextes.V[0];
  return decodeResource(resource, session);
};
