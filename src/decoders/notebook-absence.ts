import type { NotebookAbsence } from "~/models";
import { decodePronoteDate } from "./pronote-date";

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
