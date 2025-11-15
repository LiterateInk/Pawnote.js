import { TimetableEntry } from "./TimetableEntry";

export class TimetableEntryDetention extends TimetableEntry {
  public get title(): string | null {
    const value = this.cours.listeContenus.find(
      (contenu) => contenu.estHoraire
    );

    if (!value) return null;
    return value.l;
  }

  public get teachers(): Array<string> {
    return this.cours.listeContenus
      .filter((contenu) => contenu.g === 3)
      .map((contenu) => contenu.l);
  }

  public get staff(): Array<string> {
    return this.cours.listeContenus
      .filter((contenu) => contenu.g === 34)
      .map((contenu) => contenu.l);
  }

  public get rooms(): Array<string> {
    return this.cours.listeContenus
      .filter((contenu) => contenu.g === 17)
      .map((contenu) => contenu.l);
  }
}
