import { TypeHttpVariable } from "./TypeHttpVariable";

export interface EnsembleNombre {
  _T: TypeHttpVariable.TypeHttpEnsembleNombre
  V: string
}

export class TypeHttpEnsembleNombre {
  private _set = new Set<number>();

  constructor(defaultValues?: number | Array<number>) {
    this.clear();

    if (defaultValues !== undefined) {
      this.add(defaultValues);
    }
  }

  public clear(): this {
    this._set = new Set();
    return this;
  }

  add(aValeur: number | Array<number>): this {
    if (typeof aValeur === "number") {
      this._set.add(aValeur);
    }
    else if (Array.isArray(aValeur)) {
      aValeur.forEach((aVal) => {
        this._set.add(aVal);
      });
    }

    return this;
  }

  remove(aValeur: number | Array<number>): this {
    if (typeof aValeur === "number") {
      this._set.delete(aValeur);
    }
    else if (Array.isArray(aValeur)) {
      aValeur.forEach((aVal) => {
        this._set.delete(aVal);
      });
    }

    return this;
  }

  contains(aValeur: number | Array<number>): boolean {
    if (typeof aValeur === "number") {
      return this._set.has(aValeur);
    }
    let lItems = null;
    if (Array.isArray(aValeur)) {
      lItems = aValeur;
    }
    if (lItems) {
      if (lItems.length === 0) {
        return false;
      }
      return lItems.every((aVal) => {
        return this._set.has(aVal);
      });
    }
    return false;
  }

  get(aIndex: number): number | null {
    const lItems = this.items();

    if (
      aIndex < 0 ||
			aIndex > lItems.length ||
      typeof lItems[aIndex] !== "number"
    ) return null;

    return lItems[aIndex];
  }

  private _sort(a: number, b: number): number {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  public items(): Array<number> {
    const items: Array<number> = [];
    for (const lVal of this._set.values()) {
      items.push(lVal);
    }
    items.sort(this._sort);

    return items;
  }

  public count(): number {
    return this._set.size;
  }

  private _toString(): string {
    let lResult = "",
      lNbDeSuite = 0,
      lValeur,
      lItems = this.items();
    for (let lIx = 1; lIx <= lItems.length; lIx++) {
      lValeur = lItems[lIx];
      if (lItems.length > lIx && lValeur === lItems[lIx - 1] + 1) {
        lNbDeSuite++;
      }
      else {
        if (lResult.length > 0) {
          lResult += ",";
        }
        if (lNbDeSuite > 0) {
          lResult += lItems[lIx - 1 - lNbDeSuite] + "..";
        }
        lResult += lItems[lIx - 1];
        lNbDeSuite = 0;
      }
    }
    return "[" + lResult + "]";
  }

  private _fromString(aChaine: string): this {
    if (!aChaine || !aChaine.length || aChaine.length < 2) {
      return this;
    }
    aChaine = aChaine.substring(1, aChaine.length - 1);
    const T1 = aChaine.split(",");
    let T2, V1, V2;
    for (let I = 0; I < T1.length; I++) {
      T2 = T1[I].split("..");
      V1 = parseInt(T2[0], 10);
      V2 = parseInt(T2.length === 1 ? T2[0] : T2[1], 10);
      for (let J = V1; J <= V2; J++) {
        this._set.add(J);
      }
    }
    return this;
  }

  public static deserializer = (value: EnsembleNombre): Array<number> => {
    if (value._T !== TypeHttpVariable.TypeHttpEnsembleNombre)
      throw new Error("HTTP type is not compatible");

    return new TypeHttpEnsembleNombre()._fromString(value.V).items();
  };

  public serialize() {
    return {
      _T: TypeHttpVariable.TypeHttpEnsembleNombre,
      V: this._toString()
    };
  }
}
