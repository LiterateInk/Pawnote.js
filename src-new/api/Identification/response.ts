import { rename, t } from "desero";

export class IdentificationModel {
  @rename("alea")
  public seed = t.option(t.string());
  @rename("modeCompLog")
  public lowerUsername = t.boolean();
  @rename("modeCompMdp")
  public lowerMod = t.boolean();
  public challenge = t.string();
}
