import { RequestFN } from "~/core/request-function";
import { AccessDeniedError, AccountDisabledError, AuthenticateError, BadCredentialsError, type SessionHandle } from "~/models";
import { dataProperty } from "./data-property";

export const authenticate = async (session: SessionHandle, challenge: string) => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "Authentification", {
    [property]: {
      connexion: 0, // NOTE: Probably the `accessKind` property, not sure though.
      challenge,
      espace: session.information.accountKind
    }
  });

  const response = await request.send();
  const data = response.data[property];

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
