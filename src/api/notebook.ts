import { RequestFN } from "~/core/request-function";
import { decodeNotebook } from "~/decoders/notebook";
import { encodePeriod } from "~/encoders/period";
import { encodePronoteDate } from "~/encoders/pronote-date";
import { type SessionHandle, type Notebook, type Period, TabLocation } from "~/models";
import { dataProperty } from "./private/data-property";

export const notebook = async (session: SessionHandle, period: Period): Promise<Notebook> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "PagePresence", {
    _Signature_: { onglet: TabLocation.Notebook },

    [property]: {
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
  return decodeNotebook(response.data[property], session);
};
