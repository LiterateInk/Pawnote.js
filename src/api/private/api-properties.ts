import type { SessionHandle } from "~/models";
import { isVersionGte2024_3_9 } from "./versions";


/**
 * Returns the API properties based on the session version.
 * @param session - The current session handle.
 * @returns The API properties.
 */
export const apiProperties = (session: SessionHandle): { data: string; signature: string; } => {
  return isVersionGte2024_3_9(session.instance.version) ? {
    data: "data",
    signature: "Signature"
  } : {
    data: "donnees",
    signature: "_Signature_"
  };
};
