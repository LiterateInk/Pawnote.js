import { FonctionParametresResponse } from "../api/FonctionParametres";

export class Parameters {
  public constructor(
    private readonly parameters: FonctionParametresResponse
  ) {}

  public get navigatorIdentifier(): string {
    return this.parameters.data.navigatorIdentifier;
  }
}
