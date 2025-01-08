import { RequestFN } from "~/core/request-function";
import { decodeEvaluation } from "~/decoders/evaluation";
import { encodePeriod } from "~/encoders/period";
import { type Evaluation, type Period, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

export const evaluations = async (session: SessionHandle, period: Period): Promise<Array<Evaluation>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "DernieresEvaluations", {
    [properties.signature]: { onglet: TabLocation.Evaluations },

    [properties.data]: {
      periode: encodePeriod(period)
    }
  });

  const response = await request.send();

  return response.data[properties.data].listeEvaluations.V
    .map(decodeEvaluation);
};
