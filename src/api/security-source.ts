import { RequestFN } from "~/core/request-function";
import { DoubleAuthServerAction, SecuritySourceTooLongError, SessionHandle } from "~/models";
import { dataProperty } from "./private/data-property";

/**
 * @returns true if the source is already known
 */
export const securitySource = async (session: SessionHandle, source: string): Promise<boolean> => {
  const LIMIT = 30;
  if (source.length > LIMIT) throw new SecuritySourceTooLongError(LIMIT);

  const property = dataProperty(session);

  const request = new RequestFN(session, "SecurisationCompteDoubleAuth", {
    [property]: {
      action: DoubleAuthServerAction.csch_LibellesSourceConnexionDejaConnus,
      libelle: source
    }
  });

  const response = await request.send();
  return response.data[property].dejaConnu;
};
