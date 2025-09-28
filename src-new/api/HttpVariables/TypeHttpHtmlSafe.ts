import { TypeHttpVariable } from "./TypeHttpVariable";

interface HtmlSafe {
  _T: TypeHttpVariable.TypeHttpHtmlSafe
  V: string
}

export class TypeHttpHtmlSafe {
  public static deserializer = (value: HtmlSafe): string => {
    if (value._T !== TypeHttpVariable.TypeHttpHtmlSafe)
      throw new Error("HTTP type is not compatible");

    return value.V;
  };
}
