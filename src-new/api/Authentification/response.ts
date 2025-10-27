import { deserializeWith, rename, t } from "desero";
import { TypeHttpDateTime } from "../HttpVariables/TypeHttpDateTime";
import { TypeHttpEnsembleNombre } from "../HttpVariables/TypeHttpEnsembleNombre";
import { TypeModeGestionDoubleAuthentification } from "../models/TypeModeGestionDoubleAuthentification";
import { TypeActionIHMSecurisationCompte } from "../models/TypeActionIHMSecurisationCompte";
import { TypeOptionGenerationMotDePasse } from "../models/TypeOptionGenerationMotDePasse";

export class AuthentificationModel {
  @rename("Acces")
  public access = t.option(t.number());

  @rename("libelleUtil")
  public label = t.string();

  @rename("modeSecurisationParDefaut")
  public defaultSecurityMode = t.enum(TypeModeGestionDoubleAuthentification);

  @rename("cle")
  public key = t.string();

  @rename("derniereConnexion")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public lastLogin = t.option(t.instance(Date));

  @rename("jetonConnexionAppliMobile")
  public token = t.string();

  @rename("codePINFixe")
  public isPinCodeFixed = t.boolean();

  @rename("reglesSaisieMDP")
  public passwordRules = t.reference(ReglesSaisieMDP);

  @rename("actionsDoubleAuth")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public securityActions = t.option(t.array(t.enum(TypeActionIHMSecurisationCompte)));

  @rename("modesPossibles")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public availableSecurityModes = t.option(t.array(t.enum(TypeModeGestionDoubleAuthentification)));

  public changementStrategieImpose = t.option(t.boolean());

  @rename("messageForcerModificationMdp")
  public forcePasswordResetMessage = t.option(t.string());
}

export class ReglesSaisieMDP {
  public min = t.number();
  public max = t.number();

  @rename("regles")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public options = t.array(t.enum(TypeOptionGenerationMotDePasse));
}
