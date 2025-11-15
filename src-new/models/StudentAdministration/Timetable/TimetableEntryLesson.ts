import { LessonCategory } from "./LessonCategory";
import { Subject } from "./Subject";
import { TimetableEntry } from "./TimetableEntry";
import { VirtualClassroom } from "./VirtualClassroom";

export class TimetableEntryLesson extends TimetableEntry {
  public get kind(): number {
    return this.cours.g;
  }

  public get categories(): Array<LessonCategory> {
    return this.cours.cahierDeTextes?.originesCategorie.map(
      (categorie) => new LessonCategory(categorie)
    ) ?? [];
  }

  /**
   * Whenever an update is shown on a lesson.
   * @example "Classe absente"
   */
  public get status(): string | null {
    return this.cours.statut;
  }

  /**
   * Whether this lesson has been canceled or not.
   */
  public get canceled(): boolean {
    return this.cours.estAnnule ?? false;
  }

  /**
   * @returns `null` when there's no resource attached to this lesson.
   */
  public get resourceId(): string | null {
    if (this.cours.avecCdt && this.cours.cahierDeTextes) {
      return this.cours.cahierDeTextes.n;
    }

    return null;
  }

  /**
   * Whether this lesson is a test or not.
   */
  public get test(): boolean {
    return this.cours.cahierDeTextes?.estDevoir ?? false;
  }

  // TODO: find a better naming ?
  public get virtuals(): Array<VirtualClassroom> {
    return this.cours.listeVisios?.map(
      (visio) => new VirtualClassroom(visio)
    ) ?? [];
  }

  /**
   * Whether the user is exempted from this lesson or not.
   */
  public get exempted(): boolean {
    return this.cours.dispenseEleve ?? false;
  }

  public get subject(): Subject | null {
    const value = this.cours.listeContenus
      .find((contenu) => contenu.g === 16);

    if (!value) return null;
    return new Subject(value.n!, value.l, value.estServiceGroupe ?? false);
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

  public get groups(): Array<string> {
    return this.cours.listeContenus
      .filter((contenu) => contenu.g === 2)
      .map((contenu) => contenu.l);
  }
}
