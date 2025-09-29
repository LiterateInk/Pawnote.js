import { rename, t } from "desero";

export class Collectivite {
  @rename("L")
  public label = t.string();

  @rename("genreCollectivite")
  public kind = t.number();
}
