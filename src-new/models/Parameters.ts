import { FonctionParametresResponse } from "../api/FonctionParametres";

export class Parameters {
  public constructor(
    private readonly _raw: FonctionParametresResponse
  ) {}

  public get navigatorIdentifier(): string | null {
    return this._raw.data.navigatorIdentifier;
  }
}
