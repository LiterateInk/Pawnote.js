import { UnreachableError } from "../../models/Errors/UnreachableError";
import { TypeHttpVariable } from "./TypeHttpVariable";

interface DateTime {
  _T: TypeHttpVariable.TypeHttpDateTime
  V: string
}

/**
 * DateTime encoded with the following format, `d/m/yyyy[ H:M:S]`.
 * As you just saw, the time is optional and might not always be given.
 */
export class TypeHttpDateTime {
  private static readonly SHORT_DATE_RE = /^\d{2}\/\d{2}\/\d{4}$/;
  private static readonly LONG_DATE_LONG_HOURS_RE = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;
  private static readonly LONG_DATE_SHORT_HOURS_RE = /^\d{2}\/\d{2}\/\d{2} \d{2}h\d{2}$/;
  private static readonly YEAR_FIRST_TWO_CHARS = new Date().getFullYear().toString().slice(0, 2);

  public static deserializer = (value: DateTime): Date => {
    if (value._T !== TypeHttpVariable.TypeHttpDateTime)
      throw new Error("HTTP type is not compatible");

    const formatted = value.V;

    if (TypeHttpDateTime.SHORT_DATE_RE.test(formatted)) {
      const [day, month, year] = formatted.split("/").map(Number);
      return new Date(year, month - 1, day);
    }

    else if (TypeHttpDateTime.LONG_DATE_LONG_HOURS_RE.test(formatted)) {
      const [date, time] =  formatted.split(" ");
      const [day, month, year] = date.split("/").map(Number);
      const [hours, minutes, seconds] = time.split(":").map(Number);

      const instance = new Date(year, month - 1, day);
      instance.setHours(hours, minutes, seconds);
      return instance;
    }

    else if (TypeHttpDateTime.LONG_DATE_SHORT_HOURS_RE.test(formatted)) {
      const [date, time] =  formatted.split(" ");
      const [day, month, year] = date.split("/").map(Number);
      const [hours, minutes] = time.split("h").map(Number);

      const instance = new Date(parseInt(`${TypeHttpDateTime.YEAR_FIRST_TWO_CHARS}${year}`), month - 1, day);
      instance.setHours(hours, minutes);
      return instance;
    }

    throw new UnreachableError("TypeHttpDateTime.deserializer");
  };

  public static serializer(date: Date): DateTime {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    const H = date.getHours();
    const M = date.getMinutes();
    const S = date.getSeconds();

    const V = `${d}/${m}/${yyyy} ${H}:${M}:${S}`;

    return {
      _T: TypeHttpVariable.TypeHttpDateTime,
      V
    };
  }
}
