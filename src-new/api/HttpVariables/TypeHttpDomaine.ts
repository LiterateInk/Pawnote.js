import { clamp } from "../../core/clamp";
import { TypeHttpVariable } from "../HttpVariables/TypeHttpVariable";

enum ValeurSemaine {
  Full = "1",
  Empty = "0"
}

export interface Domaine {
  _T: TypeHttpVariable.TypeHttpDomaine | TypeHttpVariable.TypeHttpEnsemble | TypeHttpVariable.TypeHttpEnsembleCardinal
  V: string
}

export class TypeHttpDomaine {
  private static CTailleOuverte = -1;
  private static C_MaxDomaineCycle = 62;

  private domain: Array<ValeurSemaine>;

  constructor(
    defaultValues: string = "[]",
    private nombreValeurs = TypeHttpDomaine.C_MaxDomaineCycle
  ) {
    this.domain = this._getDomain(defaultValues, this.nombreValeurs);
  }

  private fromString(str: string, values: number) {
    if (
      !(str.charAt(0) === "[" && str.charAt(str.length - 1) === "]")
    ) {
      const lTab = str.split("");
      if (values !== null && values >= 0) {
        lTab.length = values;
      }
      return lTab.map((aVal) =>
        aVal === ValeurSemaine.Full ? ValeurSemaine.Full : ValeurSemaine.Empty
      );
    }
    str = str.substring(1, str.length - 1);
    const R = new Array(
      values !== TypeHttpDomaine.CTailleOuverte ? values : 0
    );
    const T1 = str.split(",");
    for (let I = 0; I < T1.length; I++) {
      const T2 = T1[I].split("..");
      const V1 = parseInt(T2[0]);
      const V2 = T2.length === 1 ? V1 : parseInt(T2[1]);
      for (let J = V1; J <= V2; J++) {
        R[J - 1] = ValeurSemaine.Full;
      }
    }

    if (this.nombreValeurs !== TypeHttpDomaine.CTailleOuverte) {
      this.nombreValeurs = R.length;
    }

    return R;
  }

  private _toString(): string {
    let S = "",
      N = 0;
    for (let I = 0; I <= this.domain.length; I++) {
      if (this.domain[I] === ValeurSemaine.Full) {
        N++;
      }
      else if (N > 0) {
        if (S.length) {
          S += ",";
        }
        if (N > 1) {
          S += I + 1 - N + "..";
        }
        S += I;
        N = 0;
      }
    }
    return "[" + S + "]";
  }

  clear(): this {
    this.setValue(false, 1, this.getLength());
    return this;
  }

  isEmpty(): boolean {
    return this.countValues(true) === 0;
  }

  setValue(AValeur: boolean, ADeb: number, AFin: number): this | undefined {
    if (
      ADeb > this.getLength() &&
			this.nombreValeurs !== TypeHttpDomaine.CTailleOuverte
    ) {
      return;
    }
    if (this.nombreValeurs !== TypeHttpDomaine.CTailleOuverte) {
      ADeb = clamp(ADeb, 1, this.getLength());
      AFin = clamp(
        AFin === null || AFin === undefined ? ADeb : AFin,
        1,
        this.getLength()
      );
    }
    else {
      ADeb = Math.max(ADeb, 1);
      AFin = AFin === null || AFin === undefined ? ADeb : Math.max(ADeb, AFin);
    }

    for (let I = ADeb - 1; I < AFin; I++) {
      this.domain[I] = AValeur ? ValeurSemaine.Full : ValeurSemaine.Empty;
    }

    return this;
  }

  getValueAtPosition(pos: number): boolean {
    return this.domain[pos - 1] === ValeurSemaine.Full;
  }

  getFirstPosition(full: boolean) {
    for (let I = 0; I < this.domain.length; I++) {
      const lValeur =
				this.domain[I] === null || this.domain[I] === undefined
				  ? ValeurSemaine.Empty
				  : this.domain[I];
      if (
        lValeur ===
				(full ? ValeurSemaine.Full : ValeurSemaine.Empty)
      ) {
        return I + 1;
      }
    }
    return -1;
  }

  public countValues(full = true): number {
    let count = 0;

    const value = full
      ? ValeurSemaine.Full
      : ValeurSemaine.Empty;

    for (let i = 0; i < this.domain.length; i++) {
      if (this.domain[i] === value) {
        count++;
      }
    }

    return count;
  }

  public isSingleValue(): boolean {
    return this.countValues(true) <= 1;
  }

  public getSingleValue(): number {
    return this.countValues(true) === 1 ? this.getFirstPosition(true) : 0;
  }

  public getLength(): number {
    return this.domain.length;
  }

  public getWeeks(): Array<number> {
    const length = this.getLength();
    const weeks = [];

    for (let i = 1; i <= length; i++) {
      if (this.getValueAtPosition(i)) {
        weeks.push(i);
      }
    }

    return weeks;
  }

  public clone() {
    const instance = new TypeHttpDomaine(void 0, this.nombreValeurs);
    instance.domain = [...this.domain];
    return instance;
  }

  public static deserializer = (value: Domaine): Array<number> => {
    if (![
      TypeHttpVariable.TypeHttpDomaine,
      TypeHttpVariable.TypeHttpEnsemble,
      TypeHttpVariable.TypeHttpEnsembleCardinal
    ].includes(value._T))
      throw new Error("HTTP type is not compatible");

    if (value._T === TypeHttpVariable.TypeHttpEnsembleCardinal) {
      return new TypeHttpDomaine(
        value.V,
        TypeHttpDomaine.CTailleOuverte
      ).getWeeks();
    }
    else {
      return new TypeHttpDomaine(
        value.V
      ).getWeeks();
    }
  };

  public serialize() {
    return {
      _T: TypeHttpVariable.TypeHttpDomaine,
      V: this._toString()
    };
  }

  private _getDomain(values: string | number | boolean, nombreValeurs?: number): Array<ValeurSemaine> {
    const type = typeof values;
    let domain: Array<ValeurSemaine>;

    if (type !== "object" && type !== "string") {
      domain = new Array(
        1 + (nombreValeurs ?? TypeHttpDomaine.C_MaxDomaineCycle)
      )
        .join(
          values === true
            ? ValeurSemaine.Full
            : ValeurSemaine.Empty
        )
        .split("") as Array<ValeurSemaine>;
    }

    switch (type) {
      case "number":
        domain![values as number - 1] = ValeurSemaine.Full;
        return domain!;
      case "string":
        return this.fromString(values as string, nombreValeurs!);
      default:
        return domain!;
    }
  }
}
