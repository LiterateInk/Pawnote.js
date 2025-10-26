import { TypeHttpVariable } from "./TypeHttpVariable";
import { deserialize } from "desero";

interface Element<T> {
  _T: TypeHttpVariable.TypeHttpElement
  V: Array<T> | T
}

export class TypeHttpElement<T extends new (...args: any[]) => any> {
  public constructor(
    private readonly Model: T
  ) {}

  public array = (value: Element<InstanceType<T>>): Array<InstanceType<T>> => {
    if (value._T !== TypeHttpVariable.TypeHttpElement)
      throw new Error("HTTP type is not compatible");

    if (!Array.isArray(value.V))
      throw new Error("TypeHttpElement deserializer expected an Array");

    return value.V.map((inner) => deserialize(this.Model, inner));
  };

  public single = (value: Element<InstanceType<T>>): Array<InstanceType<T>> => {
    if (value._T !== TypeHttpVariable.TypeHttpElement)
      throw new Error("HTTP type is not compatible");

    if (Array.isArray(value.V))
      throw new Error("TypeHttpElement deserializer expected a single object");

    return deserialize(this.Model, value.V);
  };
}
