import { RequestFN } from "~/core/request-function";
import { encodePeriod } from "~/encoders/period";
import { type Period, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

import { decodeGradeBook } from "~/decoders/gradebook";
import { GradeBook } from "~/models/gradebook";

export const gradebook = async (session: SessionHandle, period: Period): Promise<GradeBook> => {
  const properties = apiProperties(session);

  const periodModified = JSON.parse(JSON.stringify(period));
  periodModified.kind = 2; // Why ? Idk, but needed

  const request = new RequestFN(session, "PageBulletins", {
    [properties.data]: {
      classe: {},
      eleve: {},
      periode: encodePeriod(periodModified)
    },
    [properties.signature]: { onglet: TabLocation.Gradebook }
  });

  const response = await request.send();
  return await decodeGradeBook(session, period, response.data[properties.data]);
};
