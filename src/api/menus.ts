import { RequestFN } from "~/core/request-function";
import { decodeWeekMenu } from "~/decoders/week-menu";
import { encodePronoteDate } from "~/encoders/pronote-date";
import { TabLocation, type WeekMenu, type SessionHandle } from "~/models";
import { dataProperty } from "./private/data-property";

export const menus = async (session: SessionHandle, date = new Date()): Promise<WeekMenu> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "PageMenus", {
    _Signature_: { onglet: TabLocation.Menus },
    [property]: {
      date: {
        _T: 7,
        V: encodePronoteDate(date)
      }
    }
  });

  const response = await request.send();
  return decodeWeekMenu(response.data[property]);
};
