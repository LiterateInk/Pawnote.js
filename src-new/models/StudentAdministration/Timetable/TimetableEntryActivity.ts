import { TimetableEntry } from "./TimetableEntry";

export class TimetableEntryActivity extends TimetableEntry {
  public get title(): string {
    return this.cours.motif!;
  }

  public get attendants(): Array<string> {
    return this.cours.accompagnateurs!;
  }

  public get resourceTypeName(): string {
    return this.cours.strGenreRess!;
  }

  public get resourceValue(): string {
    return this.cours.strRess!;
  }
}
