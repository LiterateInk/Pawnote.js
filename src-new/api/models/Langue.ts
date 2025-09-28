import { rename, t } from "desero";

export class Langue {
  @rename("langID")
  public languageIdentifier = t.number();

  @rename("description")
  public label = t.string();
}
