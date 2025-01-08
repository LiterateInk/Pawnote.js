import { RequestFN } from "~/core/request-function";
import { type SessionHandle, TabLocation } from "~/models";
import { getUTCDate } from "./dates";
import { translateToWeekNumber } from "../helpers/week-number";
import { dataProperty } from "./data-property";

export const homeworkFromWeek = async (session: SessionHandle, tab: TabLocation, weekNumber: number, extendsToWeekNumber?: number): Promise<any> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "PageCahierDeTexte", {
    _Signature_: { onglet: tab },
    [property]: {
      domaine: {
        _T: 8,
        V: typeof extendsToWeekNumber === "number" ? `[${weekNumber}..${extendsToWeekNumber}]` : `[${weekNumber}]`
      }
    }
  });

  const response = await request.send();
  return response.data[property];
};

export const homeworkFromIntervals = async (session: SessionHandle, tab: TabLocation, startDate: Date, endDate: Date): Promise<any> => {
  startDate = getUTCDate(startDate);
  endDate = getUTCDate(endDate);

  const startWeekNumber = translateToWeekNumber(startDate, session.instance.firstMonday);
  const endWeekNumber = translateToWeekNumber(endDate, session.instance.firstMonday);

  return homeworkFromWeek(session, tab, startWeekNumber, endWeekNumber);
};
