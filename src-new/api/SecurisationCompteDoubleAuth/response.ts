import { rename, t } from "desero";

export class SecurisationCompteDoubleAuthModel {
  @rename("result")
  public ok = t.option(t.boolean());

  @rename("dejaConnu")
  public alreadyKnown = t.option(t.boolean());

  @rename("jetonConnexionAppliMobile")
  public token = t.option(t.string());
}
