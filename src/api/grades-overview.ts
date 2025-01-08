import { RequestFN } from "~/core/request-function";
import { decodeGradesOverview } from "~/decoders/grades-overview";
import { encodePeriod } from "~/encoders/period";
import { type Period, type GradesOverview, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Get grades overview for a specific period.
 * Including student's grades with averages and the global averages
 */
export const gradesOverview = async (session: SessionHandle, period: Period): Promise<GradesOverview> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "DernieresNotes", {
    [properties.signature]: { onglet: TabLocation.Grades },

    [properties.data]: {
      Periode: encodePeriod(period)
    }
  });

  const response = await request.send();
  return decodeGradesOverview(response.data[properties.data], session);
};
