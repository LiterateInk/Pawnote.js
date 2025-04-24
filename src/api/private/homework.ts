import { RequestFN } from "~/core/request-function";
import { type SessionHandle, TabLocation } from "~/models";
import { getUTCDate } from "./dates";
import { translateToWeekNumber } from "../helpers/week-number";
import { apiProperties } from "./api-properties";

/**
 * Fetches homework for a specific week or range of weeks.
 * @param session - The current session handle.
 * @param tab - The tab location to fetch homework from.
 * @param weekNumber - The week number to fetch homework for.
 * @param extendsToWeekNumber - Optional, the week number to extend the range to.
 * @returns A promise that resolves to the homework data.
 */
export const homeworkFromWeek = async (session: SessionHandle, tab: TabLocation, weekNumber: number, extendsToWeekNumber?: number): Promise<any> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PageCahierDeTexte", {
    [properties.signature]: { onglet: tab },
    [properties.data]: {
      domaine: {
        _T: 8,
        V: typeof extendsToWeekNumber === "number" ? `[${weekNumber}..${extendsToWeekNumber}]` : `[${weekNumber}]`
      }
    }
  });

  const response = await request.send();
  return response.data[properties.data];
};

export const homeworkFromIntervals = async (session: SessionHandle, tab: TabLocation, startDate: Date, endDate: Date): Promise<any> => {
  startDate = getUTCDate(startDate);
  endDate = getUTCDate(endDate);

  const startWeekNumber = translateToWeekNumber(startDate, session.instance.firstMonday);
  const endWeekNumber = translateToWeekNumber(endDate, session.instance.firstMonday);

  return homeworkFromWeek(session, tab, startWeekNumber, endWeekNumber);
};
