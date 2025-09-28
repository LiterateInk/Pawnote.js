import { AsyncQueue } from "maqueue";
import { HomepageSession } from "./HomepageSession";
import { Version } from "./Version";

interface Properties {
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
}

export class SessionAPI {
  public order = 0;
  public queue = new AsyncQueue();

  public skipEncryption: boolean;
  public skipCompression: boolean;

  public properties: Properties;

  /** @internal */
  public constructor(session: HomepageSession, version: Version) {
    if (Version.isGreaterThanOrEqualTo202513(version)) {
      this.skipEncryption = !session.enforceEncryption;
      this.skipCompression = !session.enforceCompression;
    }
    else {
      this.skipEncryption = session.skipEncryption;
      this.skipCompression = session.skipCompression;
    }

    if (Version.isGreaterThanOrEqualTo202513(version)) {
      this.properties = {
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
    else {
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

      if (Version.isGreaterThanOrEqualTo202439(version)) {
        this.properties = {
          ...common,
          data: "data",
          signature: "Signature"
        };
      }

      this.properties = {
        ...common,
        data: "donnees",
        signature: "_Signature_"
      };
    }
  }
}
