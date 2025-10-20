import { deserializeWith, rename, t } from "desero";
import { TypeHttpDateTime } from "../HttpVariables/TypeHttpDateTime";
import { TypeHttpEnsembleNombre } from "../HttpVariables/TypeHttpEnsembleNombre";

export class AuthentificationModel {
  @rename("Acces")
  public access = t.option(t.number());

  @rename("libelleUtil")
  public label = t.string();

  @rename("modeSecurisationParDefaut")
  public defaultSecurityMode = t.number(); // TODO: find enum

  @rename("cle")
  public key = t.string();

  @rename("derniereConnexion")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public lastLogin = t.instance(Date);

  @rename("jetonConnexionAppliMobile")
  public token = t.string();

  @rename("codePINFixe")
  public isPinCodeFixed = t.boolean();

  @rename("reglesSaisieMDP")
  public changePasswordRules = t.reference(ReglesSaisieMDP);

  public actionsDoubleAuth = t.option(t.instance<any>()); // TODO
}

class ReglesSaisieMDP {
  public min = t.number();
  public max = t.number();

  @rename("regles")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public rules = t.array(t.number()); // TODO: find enum
}
