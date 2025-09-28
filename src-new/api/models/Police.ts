import { rename, t } from "desero";

export class Police {
  @rename("L")
  public name = t.string();
}
