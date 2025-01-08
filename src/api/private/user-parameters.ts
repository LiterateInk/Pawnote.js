import { RequestFN } from "~/core/request-function";
import { decodeUserParameters } from "~/decoders/user-parameters";
import type { SessionHandle } from "~/models";
import { UserParameters } from "~/models/user-parameters";
import { dataProperty } from "./data-property";

export const userParameters = async (session: SessionHandle): Promise<UserParameters> => {
  const request = new RequestFN(session, "ParametresUtilisateur", {});
  const response = await request.send();
  return decodeUserParameters(response.data[dataProperty(session)], session);
};
