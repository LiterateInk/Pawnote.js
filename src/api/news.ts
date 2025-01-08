import { RequestFN } from "~/core/request-function";
import { decodeNews } from "~/decoders/news";
import { encodeDomain } from "~/encoders/domain";
import { type News, type SessionHandle, TabLocation } from "~/models";
import { dataProperty } from "./private/data-property";

export const news = async (session: SessionHandle): Promise<News> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "PageActualites", {
    _Signature_: { onglet: TabLocation.News },

    [property]: {
      modesAffActus: {
        _T: 26,
        V: encodeDomain([0])
      }
    }
  });

  const response = await request.send();
  return decodeNews(response.data[property], session);
};
