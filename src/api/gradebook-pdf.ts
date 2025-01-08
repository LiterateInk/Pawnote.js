import { RequestFN } from "~/core/request-function";
import { encodePeriod } from "~/encoders/period";
import { type Period, type SessionHandle, TabLocation } from "~/models";
import { dataProperty } from "./private/data-property";

/**
 * @param period - Period the grades report will be from.
 * @returns URL to download the PDF file.
 */
export const gradebookPDF = async (session: SessionHandle, period: Period): Promise<string> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "GenerationPDF", {
    [property]: {
      avecCodeCompetences: false,
      genreGenerationPDF: 2,

      options: { // defaults from PRONOTE
        adapterHauteurService: false,
        desEleves: false,
        gererRectoVerso: false,
        hauteurServiceMax: 15,
        hauteurServiceMin: 10,
        piedMonobloc: true,
        portrait: true,
        taillePolice: 6.5,
        taillePoliceMin: 5,
        taillePolicePied: 6.5,
        taillePolicePiedMin: 5
      },

      periode: encodePeriod(period)
    },

    _Signature_: { onglet: TabLocation.Gradebook }
  });

  const response = await request.send();
  return session.information.url + "/" + encodeURI(response.data[property].url.V);
};
