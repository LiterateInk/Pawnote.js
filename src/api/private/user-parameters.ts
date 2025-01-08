import { RequestFN } from "~/core/request-function";
import { decodeUserParameters } from "~/decoders/user-parameters";
import type { SessionHandle } from "~/models";
import { UserParameters } from "~/models/user-parameters";
import { apiProperties } from "./api-properties";

export const userParameters = async (session: SessionHandle): Promise<UserParameters> => {
  const request = new RequestFN(session, "ParametresUtilisateur", {});
  const response = await request.send();
  return decodeUserParameters(response.data[apiProperties(session).data], session);
};
