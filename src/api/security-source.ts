import { RequestFN } from "~/core/request-function";
import { DoubleAuthServerAction, SecuritySourceTooLongError, SessionHandle } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Check if the source is already known.
 * @param session - The current session handle.
 * @param source - The source to check.
 * @returns true if the source is already known
 */
export const securitySource = async (session: SessionHandle, source: string): Promise<boolean> => {
  const LIMIT = 30;
  if (source.length > LIMIT) throw new SecuritySourceTooLongError(LIMIT);

  const properties = apiProperties(session);

  const request = new RequestFN(session, "SecurisationCompteDoubleAuth", {
    [properties.data]: {
      action: DoubleAuthServerAction.csch_LibellesSourceConnexionDejaConnus,
      libelle: source
    }
  });

  const response = await request.send();
  return response.data[properties.data].dejaConnu;
};
