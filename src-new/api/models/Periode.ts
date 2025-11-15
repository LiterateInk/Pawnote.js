import { deserializeWith, rename, t } from "desero";
import { TypeHttpDateTime } from "../HttpVariables/TypeHttpDateTime";

export class Periode {
  @rename("L")
  public l = t.string();

  @rename("N")
  public n = t.string();

  @rename("G")
  public g = t.number();

  public periodeNotation = t.number();

  @deserializeWith(TypeHttpDateTime.deserializer)
  public dateDebut = t.instance(Date);

  @deserializeWith(TypeHttpDateTime.deserializer)
  public dateFin = t.instance(Date);
}
