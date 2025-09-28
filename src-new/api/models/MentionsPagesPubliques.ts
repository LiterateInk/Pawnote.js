import { TypeHttpHtmlSafe } from "../HttpVariables/TypeHttpHtmlSafe";
import { rename, deserializeWith, t } from "desero";

export class MentionsPagesPubliques {
  @rename("lien")
  @deserializeWith(TypeHttpHtmlSafe.deserializer)
  public link = t.string();
}
