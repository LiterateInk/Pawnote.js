import { TypeHttpVariable } from "./TypeHttpVariable";

export interface Note {
  _T: TypeHttpVariable.TypeHttpNote
  V: string
}

export class TypeHttpNote {
  public constructor(
    public value: string
  ) {}

  public static deserializer = (value: Note): TypeHttpNote => {
    if (value._T !== TypeHttpVariable.TypeHttpNote)
      throw new Error("HTTP type is not compatible");

    return new this(value.V);
  };
}
