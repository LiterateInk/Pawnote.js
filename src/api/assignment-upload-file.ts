import { UploadSizeError, TabLocation, type SessionHandle, DocumentKind, EntityState } from "~/models";
import type { FormDataFile } from "@literate.ink/utilities";
import { createEntityID } from "~/api/helpers/entity-id";
import { RequestUpload } from "~/core/request-upload";
import { RequestFN } from "~/core/request-function";
import { apiProperties } from "./private/api-properties";

export const assignmentUploadFile = async (session: SessionHandle, assignmentID: string, file: FormDataFile, fileName: string): Promise<void> => {
  // Check if the file can be uploaded.
  // Otherwise we'll get an error during the upload.
  // @ts-expect-error : trust the process.
  const fileSize: number | undefined = file.size || file.byteLength;
  const maxFileSize = session.user.authorizations.maxAssignmentFileUploadSize;
  if (typeof fileSize === "number" && fileSize > maxFileSize) {
    throw new UploadSizeError(maxFileSize);
  }

  // Ask to the server to store the file for us.
  const fileUpload = new RequestUpload(session, "SaisieTAFARendreEleve", file, fileName);
  await fileUpload.send();

  const properties = apiProperties(session);


  // Now we can link the file to the assignment.
  const request = new RequestFN(session, "SaisieTAFARendreEleve", {
    [properties.signature]: { onglet: TabLocation.Assignments },

    [properties.data]: {
      listeFichiers: [{
        E: EntityState.CREATION,
        G: DocumentKind.FILE,
        L: fileName,
        N: createEntityID(),
        idFichier: fileUpload.id,
        TAF: { N: assignmentID }
      }]
    }
  });

  await request.send();
};
