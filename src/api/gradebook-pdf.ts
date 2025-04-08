import { RequestFN } from "~/core/request-function";
import { encodePeriod } from "~/encoders/period";
import { type Period, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * @param {Period} period - Period the grades report will be from.
 * @returns {Promise<string>} URL to download the PDF file.
 */
export const gradebookPDF = async (session: SessionHandle, period: Period): Promise<string> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "GenerationPDF", {
    [properties.data]: {
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

    [properties.signature]: { onglet: TabLocation.Gradebook }
  });

  const response = await request.send();
  return session.information.url + "/" + encodeURI(response.data[properties.data].url.V);
};
