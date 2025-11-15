export class Subject {
  /** @internal */
  public constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly inGroups: boolean
  ) {}
}
