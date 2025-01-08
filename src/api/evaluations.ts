import { RequestFN } from "~/core/request-function";
import { decodeEvaluation } from "~/decoders/evaluation";
import { encodePeriod } from "~/encoders/period";
import { type Evaluation, type Period, type SessionHandle, TabLocation } from "~/models";
import { dataProperty } from "./private/data-property";

export const evaluations = async (session: SessionHandle, period: Period): Promise<Array<Evaluation>> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "DernieresEvaluations", {
    _Signature_: { onglet: TabLocation.Evaluations },

    [property]: {
      periode: encodePeriod(period)
    }
  });

  const response = await request.send();

  return response.data[property].listeEvaluations.V
    .map(decodeEvaluation);
};
