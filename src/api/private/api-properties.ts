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
  session: string;

  fileUploadOrderNumber: string
  fileUploadSession: string
  fileUploadRequestId: string
  fileUploadFileId: string
  fileUploadMd5: string
} => {
  if (isVersionGte2025_1_3(session.instance.version)) {
    return {
      data: "data",
      orderNumber: "no",
      secureData: "dataSec",
      requestId: "id",
      signature: "Signature",
      session: "session",

      fileUploadOrderNumber: "u_no",
      fileUploadSession: "u_ns",
      fileUploadRequestId: "u_idR",
      fileUploadFileId: "u_idF",
      fileUploadMd5: "u_md5"
    };
  }

  let common = {
    orderNumber: "numeroOrdre",
    secureData: "donneesSec",
    requestId: "nom",
    session: "session",

    fileUploadOrderNumber: "numeroOrdre",
    fileUploadSession: "numeroSession",
    fileUploadRequestId: "nomRequete",
    fileUploadFileId: "idFichier",
    fileUploadMd5: "md5"
  };

  if (isVersionGte2024_3_9(session.instance.version)) {
    return {
      ...common,
      data: "data",
      signature: "Signature"
    };
  }

  // older versions.
  return {
    ...common,
    data: "donnees",
    signature: "_Signature_"
  };
};
