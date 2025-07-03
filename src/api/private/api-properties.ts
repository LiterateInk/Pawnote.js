import type { SessionHandle } from "~/models";
import { isVersionGte2024_3_9, isVersionGte2025_1_3 } from "./versions";

/**
 * Returns the API properties based on the session version.
 * @param session - The current session handle.
 * @returns The API properties.
 */
export const apiProperties = (session: SessionHandle): {
  data: string;
  requestId: string
  signature: string;
  orderNumber: string;
  secureData: string;
} => {
  if (isVersionGte2025_1_3(session.instance.version)) {
    return {
      data: "data",
      orderNumber: "no",
      secureData: "dataSec",
      requestId: "id",
      signature: "Signature"
    };
  }

  else if (isVersionGte2024_3_9(session.instance.version)) {
    return {
      data: "data",
      orderNumber: "numeroOrdre",
      secureData: "donneesSec",
      requestId: "nom",
      signature: "Signature"
    };
  }

  // older versions.
  else return {
    data: "donnees",
    orderNumber: "numeroOrdre",
    secureData: "donneesSec",
    requestId: "nom",
    signature: "_Signature_"
  };
};
