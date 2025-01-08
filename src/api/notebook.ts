import { RequestFN } from "~/core/request-function";
import { decodeNotebook } from "~/decoders/notebook";
import { encodePeriod } from "~/encoders/period";
import { encodePronoteDate } from "~/encoders/pronote-date";
import { type SessionHandle, type Notebook, type Period, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

export const notebook = async (session: SessionHandle, period: Period): Promise<Notebook> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PagePresence", {
    [properties.signature]: { onglet: TabLocation.Notebook },

    [properties.data]: {
      periode: encodePeriod(period),

      DateDebut: {
        _T: 7,
        V: encodePronoteDate(period.startDate)
      },

      DateFin: {
        _T: 7,
        V: encodePronoteDate(period.endDate)
      }
    }
  });

  const response = await request.send();
  return decodeNotebook(response.data[properties.data], session);
};
