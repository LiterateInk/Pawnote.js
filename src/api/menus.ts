import { RequestFN } from "~/core/request-function";
import { decodeWeekMenu } from "~/decoders/week-menu";
import { encodePronoteDate } from "~/encoders/pronote-date";
import { TabLocation, type WeekMenu, type SessionHandle } from "~/models";
import { apiProperties } from "./private/api-properties";

export const menus = async (session: SessionHandle, date = new Date()): Promise<WeekMenu> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PageMenus", {
    [properties.signature]: { onglet: TabLocation.Menus },
    [properties.data]: {
      date: {
        _T: 7,
        V: encodePronoteDate(date)
      }
    }
  });

  const response = await request.send();
  return decodeWeekMenu(response.data[properties.data]);
};
