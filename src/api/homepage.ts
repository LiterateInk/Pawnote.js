import { RequestFN } from "~/core/request-function";
import { encodePronoteDate } from "~/encoders/pronote-date";
import { TabLocation, type SessionHandle } from "~/models";
import { translateToWeekNumber } from "./helpers/week-number";
import { decodeHomepage } from "~/decoders/homepage";
import type { Homepage } from "~/models/homepage";
import { dataProperty } from "./private/data-property";

/**
 * Retrieve data from the homepage for the given session.
 */
export const homepage = async (session: SessionHandle, day = session.instance.nextBusinessDay): Promise<Homepage> => {
  const property = dataProperty(session);

  const weekNumber = translateToWeekNumber(day, session.instance.firstMonday);
  const next = encodePronoteDate(day);

  const request = new RequestFN(session, "PageAccueil", {
    _Signature_: { onglet: TabLocation.Presence },

    [property]: {
      avecConseilDeClasse: true,

      dateGrille: {
        _T: 7,
        V: next
      },

      numeroSemaine: weekNumber,

      coursNonAssures: {
        numeroSemaine: weekNumber
      },

      personnelsAbsents: {
        numeroSemaine: weekNumber
      },

      incidents: {
        numeroSemaine: weekNumber
      },

      exclusions: {
        numeroSemaine: weekNumber
      },

      donneesVS: {
        numeroSemaine: weekNumber
      },

      registreAppel: {
        date: {
          _T: 7,
          V: next
        }
      },

      previsionnelAbsServiceAnnexe: {
        date: {
          _T: 7,
          V: next
        }
      },

      donneesProfs: {
        numeroSemaine: weekNumber
      },

      EDT: {
        numeroSemaine: weekNumber
      },

      TAFARendre: {
        date: {
          _T: 7,
          V: next
        }
      },

      TAFEtActivites: {
        date: {
          _T: 7,
          V: next
        }
      },

      partenaireCDI: {
        CDI: {}
      },

      tableauDeBord: {
        date: {
          _T: 7,
          V: next
        }
      },

      modificationsEDT: {
        date: {
          _T: 7,
          V: next
        }
      }
    }
  });

  const response = await request.send();
  return decodeHomepage(response.data[property]);
};
