import type { SessionHandle } from "~/models";
import { isVersionGte2024_3_9 } from "./versions";



export const apiProperties = (session: SessionHandle) => {
  return isVersionGte2024_3_9(session.instance.version) ? {
    data: "data",
    signature: "Signature"
  } : {
    data: "donnees",
    signature: "_Signature_"
  };
};
