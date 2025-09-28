import { TypeHttpVariable } from "./TypeHttpVariable";

interface ChaineBrute {
  _T: TypeHttpVariable.TypeHttpChaineBrute
  V: string
}

export class TypeHttpChaineBrute {
  public static deserializer = (value: ChaineBrute): string => {
    if (value._T !== TypeHttpVariable.TypeHttpChaineBrute)
      throw new Error("HTTP type is not compatible");

    return value.V;
  };
}
