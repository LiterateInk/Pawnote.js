import type { NotebookAbsence } from "~/models";
import { decodePronoteDate } from "./pronote-date";

/**
 * Decode a notebook absence from the server response.
 * @param absence - The absence data from the server.
 * @returns The decoded notebook absence object.
 */
export const decodeNotebookAbsence = (absence: any): NotebookAbsence => {
  const [hoursMissed, minutesMissed] = (absence.NbrHeures as string).split("h").map(Number);
  const isReasonUnknown = absence.estMotifNonEncoreConnu;

  return {
    id: absence.N,
    startDate: decodePronoteDate(absence.dateDebut.V),
    endDate: decodePronoteDate(absence.dateFin.V),
    justified: absence.justifie,
    opened: absence.ouverte,
    hoursMissed, minutesMissed,
    daysMissed: absence.NbrJours,
    shouldParentsJustify: absence.aJustifierParParents,
    administrativelyFixed: absence.reglee,
    isReasonUnknown,
    reason: !isReasonUnknown && absence.listeMotifs.V[0].L
  };
};
