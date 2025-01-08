import { RequestFN } from "~/core/request-function";
import { decodeNews } from "~/decoders/news";
import { encodeDomain } from "~/encoders/domain";
import { type News, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

export const news = async (session: SessionHandle): Promise<News> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PageActualites", {
    [properties.signature]: { onglet: TabLocation.News },

    [properties.data]: {
      modesAffActus: {
        _T: 26,
        V: encodeDomain([0])
      }
    }
  });

  const response = await request.send();
  return decodeNews(response.data[properties.data], session);
};
