import { RequestFN } from "~/core/request-function";
import { AccessDeniedError, AccountDisabledError, AuthenticateError, BadCredentialsError, type SessionHandle } from "~/models";
import { apiProperties } from "./api-properties";

/**
 * Authenticates the user with the given challenge.
 * @param session - The current session handle.
 * @param challenge - The challenge to authenticate with.
 * @returns The authentication data.
 */
export const authenticate = async (session: SessionHandle, challenge: string) => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "Authentification", {
    [properties.data]: {
      connexion: 0, // NOTE: Probably the `accessKind` property, not sure though.
      challenge,
      espace: session.information.accountKind
    }
  });

  const response = await request.send();
  const data = response.data[properties.data];

  // Handle potential errors.
  if (typeof data.Acces === "number" && data.Acces !== 0) {
    switch (data.Acces) {
      case 1: // EGenreErreurAcces.Identification
        throw new BadCredentialsError();

      case 2: // EGenreErreurAcces.Autorisation
      case 3: // EGenreErreurAcces.ConnexionClasse
      case 4: // EGenreErreurAcces.AucuneRessource
      case 5: // EGenreErreurAcces.Connexion
      case 7: // EGenreErreurAcces.FonctionAccompagnant
      case 8: // EGenreErreurAcces.AccompagnantAucunEleve
        throw new AccessDeniedError();

      case 6: // EGenreErreurAcces.BloqueeEleve
      case 10: // EGenreErreurAcces.CompteDesactive
        throw new AccountDisabledError();

      case 9: // EGenreErreurAcces.Message
        if (typeof data.AccesMessage !== "undefined") {
          let error: string = data.AccesMessage.message ?? "(none)";

          if (data.AccesMessage.titre) {
            error += `${data.AccesMessage.titre} ${error}`;
          }

          throw new AuthenticateError(error);
        }
    }
  }

  return data;
};
