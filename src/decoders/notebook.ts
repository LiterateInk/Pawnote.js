import type { Notebook, NotebookAbsence, NotebookDelay, NotebookObservation, NotebookPrecautionaryMeasure, NotebookPunishment, SessionHandle } from "~/models";
import { decodeNotebookAbsence } from "./notebook-absence";
import { decodeNotebookDelay } from "./notebook-delay";
import { decodeNotebookPunishment } from "./notebook-punishment";
import { decodeNotebookObservation } from "./notebook-observation";
import { decodeNotebookPrecautionaryMeasure } from "./notebook-precautionary-measure";

/**
 * Decode a notebook from the server response.
 * @param notebook - The notebook data from the server.
 * @param session - The current session handle.
 * @returns The decoded notebook object.
 */
export const decodeNotebook = (notebook: any, session: SessionHandle): Notebook => {
  const absences: NotebookAbsence[] = [];
  const delays: NotebookDelay[] = [];
  const punishments: NotebookPunishment[] = [];
  const observations: NotebookObservation[] = [];
  const precautionaryMeasures: NotebookPrecautionaryMeasure[] = [];

  for (const item of notebook.listeAbsences.V) {
    switch (item.G) {
      case 13: // Absence
        absences.push(decodeNotebookAbsence(item));
        break;
      case 14: // Delay
        delays.push(decodeNotebookDelay(item));
        break;
      case 41: // Punishment
        punishments.push(decodeNotebookPunishment(item, session));
        break;
      case 46: // ObservationProfesseurEleve
        observations.push(decodeNotebookObservation(item));
        break;
      case 72: // PrecautionaryMeasure
        precautionaryMeasures.push(decodeNotebookPrecautionaryMeasure(item, session));
        break;
    }
  }

  // TODO: .Matieres
  // TODO: .listeRecapitulatifs
  // NOTE: not sure if .autorisations is needed, for now.
  // NOTE: not sure what .nbMaxJoursDeclarationAbsence and .listeSanctionUtilisateur are about, for now.

  return {
    absences,
    delays,
    punishments,
    observations,
    precautionaryMeasures
  };
};
