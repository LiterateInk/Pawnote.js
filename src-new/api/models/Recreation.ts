import { rename, t } from "desero";

export class Recreation {
  @rename("L")
  public label = t.string();

  @rename("place")
  public slot = t.number();
}
