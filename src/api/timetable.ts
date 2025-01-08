import { TabLocation, type SessionHandle, type Timetable } from "~/models";
import { propertyCaseInsensitive } from "./private/property-case-insensitive";
import { RequestFN } from "~/core/request-function";
import { encodeUserResource } from "~/encoders/user-resource";
import { decodeTimetable } from "~/decoders/timetable";
import { encodePronoteDate } from "~/encoders/pronote-date";
import { apiProperties } from "./private/api-properties";

const timetable = async (session: SessionHandle, additional = {}): Promise<Timetable> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PageEmploiDuTemps", {
    [properties.signature]: { onglet: TabLocation.Timetable },

    [properties.data]: {
      estEDTAnnuel: false,
      estEDTPermanence: false,

      avecAbsencesEleve: false,
      avecRessourcesLibrePiedHoraire: false,

      avecAbsencesRessource: true,
      avecInfosPrefsGrille: true,
      avecConseilDeClasse: true,
      avecCoursSortiePeda: true,
      avecDisponibilites: true,
      avecRetenuesEleve: true,

      edt: { G: 16, L: "Emploi du temps" },

      ...propertyCaseInsensitive("ressource", encodeUserResource(session.userResource)),
      ...additional
    }
  });

  const response = await request.send();
  return decodeTimetable(response.data[properties.data], session);
};

export const timetableFromWeek = async (session: SessionHandle, weekNumber: number): Promise<Timetable> => {
  return timetable(session, propertyCaseInsensitive("numeroSemaine", weekNumber));
};

export const timetableFromIntervals = async (session: SessionHandle, startDate: Date, endDate?: Date): Promise<Timetable> => {
  return timetable(session, {
    ...propertyCaseInsensitive("dateDebut", {
      _T: 7,
      V: encodePronoteDate(startDate)
    }),

    ...(endDate && propertyCaseInsensitive("dateFin", {
      _T: 7,
      V: encodePronoteDate(endDate)
    }))
  });
};
