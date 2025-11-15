import { TypeOrigineCreationCategorieCahierDeTexte } from "~/api/models/TypeOrigineCreationCategorieCahierDeTexte";
import { PageEmploiDuTempsResponse } from "~/api/PageEmploiDuTemps";
import { Cours, OrigineCategorie, Visio } from "~/api/PageEmploiDuTemps/response";
import { Parameters } from "~/models/Parameters";

export class TimetableEntry {
  /** @internal */
  public constructor(
    protected readonly parameters: Parameters,
    protected readonly cours: Cours
  ) {}

  public get id(): string {
    return this.cours.n;
  }

  public get backgroundColor(): string | null {
    return this.cours.couleurFond;
  }

  public get startDate(): Date {
    return this.cours.dateDuCours;
  }

  public get endDate(): Date {
    if (this.cours.dateDuCoursFin) {
      return this.cours.dateDuCoursFin;
    }
    else {
      let position = this.blockPosition % this.parameters.slotsPerDay + this.blockLength - 1;

      if (position > this.parameters.endings.length) {
        position %= this.parameters.endings.length - 1;
      }

      const formatted = this.parameters.endings[position];
      const [hours, minutes] = formatted.split("h").map(Number);

      const endDate = new Date(this.startDate);
      endDate.setHours(hours, minutes);

      return endDate;
    }
  }

  public get blockLength(): number {
    return this.cours.duree;
  }

  public get blockPosition(): number {
    return this.cours.place;
  }

  public get notes(): string | null {
    return this.cours.memo;
  }

  public get weekNumber(): number {
    return this.parameters.dateToWeekNumber(this.startDate);
  }
}

export class Subject {
  /** @internal */
  public constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly inGroups: boolean
  ) {}
}

export class LessonCategory {
  /** @internal */
  public constructor(
    private categorie: OrigineCategorie
  ) {}

  // TODO: refactor this type
  public get origin(): TypeOrigineCreationCategorieCahierDeTexte {
    return this.categorie.g;
  }

  public get name(): string {
    return this.categorie.l;
  }

  public get label(): string {
    return this.categorie.libelleIcone;
  }

  public get test(): boolean {
    return this.categorie.g === TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir
        || this.categorie.g === TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation;
  }
}

export class VirtualClassroom {
  /** @internal */
  public constructor(
    private visio: Visio
  ) {}

  public get url(): string {
    return this.visio.url;
  }

  public get name(): string | null {
    return this.visio.libelleLien;
  }

  public get details(): string | null {
    return this.visio.commentaire;
  }
}

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

export class Timetable {
  /**
   * Each entry of the timetable directly as PRONOTE
   * gave it to us sorted by start date.
   *
   * If you need proper filtering to prevent
   * multiple lessons overlapping using the official
   * PRONOTE algorithm, see {@link Timetable.filter | `Timetable#filter`} method.
   */
  public readonly entries: Array<TimetableEntry>;

  public constructor(
    private parameters: Parameters,
    private timetable: PageEmploiDuTempsResponse
  ) {
    this.entries = timetable.data.ListeCours.map((lesson) => {
      if (lesson.estSortiePedagogique) {
        return new TimetableEntryActivity(parameters, lesson);
      }
      if (lesson.estRetenue) {
        return new TimetableEntryDetention(parameters, lesson);
      }

      return new TimetableEntryLesson(parameters, lesson);
    });

    this.entries.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  private get withCanceledClasses(): boolean {
    return this.timetable.data.avecCoursAnnule; // NOTE: if optional, use `?? true` !
  }

  /**
   * Uses the official PRONOTE algorithm to filter
   * out entries that are not matching the given parameters.
   */
  public filter(
    withSuperposedCanceledClasses = false,
    withCanceledClasses = this.withCanceledClasses,
    withPlannedClasses = true
  ): Array<TimetableEntry> {
    const invisible = new Set<TimetableEntry>();

    if (!withCanceledClasses) {
      for (const current of this.entries) {
        if (current instanceof TimetableEntryLesson && current.canceled) {
          invisible.add(current);
        }
      }
    }

    console.log(withPlannedClasses);
    if (!withPlannedClasses) {
      for (const current of this.entries) {
        if (
          current instanceof TimetableEntryLesson &&
          !invisible.has(current) &&
          !current.canceled &&
        [ // TODO: create lesson kind enum
          0, // EnseignementNormal
          // 1, // ConseilDeClasse
          // 2, // EnseignementRemplacement
          3, // EnseignementHistorique
          4 // EnseignementSuppleant
        ].includes(current.kind)
        ) invisible.add(current);
      }
    }

    if (withCanceledClasses && !withSuperposedCanceledClasses) {
      let foundInvisibleCanceled = true;
      while (foundInvisibleCanceled) {
        foundInvisibleCanceled = this.makeSuperimposedCanceledClassesInvisible(invisible);
      }
    }

    return this.entries.filter(
      (entry) => !invisible.has(entry)
    );
  }

  /**
   * Returns the end block position of a given class.
   * @param givenClass - The class to get the end block position of.
   * @returns The end block position of the class.
   */
  private getClassEndBlockPosition (givenClass: TimetableEntry): number {
    const blocksPerDay = this.parameters.slotsPerDay;

    const startBlockPosition = Math.floor(givenClass.blockPosition / blocksPerDay);
    let endBlockPosition = givenClass.blockPosition + givenClass.blockLength - 1;

    if (Math.floor(endBlockPosition / blocksPerDay) !== startBlockPosition) {
      endBlockPosition = startBlockPosition * blocksPerDay + blocksPerDay - 1;
    }

    return endBlockPosition;
  };

  /**
   * Returns the indexes of the superimposed classes.
   * @param classItem - The class to get the superimposed classes of.
   * @param classIndex - The index of the class to get the superimposed classes of.
   * @param busyPositions - The busy positions of the classes.
   * @returns The indexes of the superimposed classes.
   */
  private getSuperimposedClassesIndexes (
    classItem: TimetableEntry,
    classIndex: number,
    busyPositions: number[]
  ) {
    const classesSuperimposed = [classIndex];

    const startBlockPosition = classItem.blockPosition;
    const endBlockPosition = this.getClassEndBlockPosition(classItem);

    for (let currentBlockPosition = startBlockPosition; currentBlockPosition <= endBlockPosition; currentBlockPosition++) {
      const busyClassIndex = busyPositions[currentBlockPosition];

      if (typeof busyClassIndex !== "undefined") {
        if (
          busyClassIndex !== classIndex &&
          !classesSuperimposed.includes(busyClassIndex)
        ) classesSuperimposed.push(busyClassIndex);
      }
    }

    return classesSuperimposed;
  };

  /**
   * Makes the superimposed canceled classes invisible.
   * @returns `true` if a class was made invisible, `false` otherwise.
   */
  private makeSuperimposedCanceledClassesInvisible (invisible: Set<TimetableEntry>): boolean {
    /** key = week number, value */
    const busyPositionsPerWeek: Record<number, number[]> = {};

    for (let classIndex = 0; classIndex < this.entries.length; classIndex++) {
      const currentClass = this.entries[classIndex];

      if (!(currentClass.weekNumber in busyPositionsPerWeek)) busyPositionsPerWeek[currentClass.weekNumber] = [];
      const busyPositions = busyPositionsPerWeek[currentClass.weekNumber];

      const startBlockPosition = currentClass.blockPosition;
      const endBlockPosition = this.getClassEndBlockPosition(currentClass);

      if (!invisible.has(currentClass)) {
        for (let currentBlockPosition = startBlockPosition; currentBlockPosition <= endBlockPosition; currentBlockPosition++) {
          if (typeof busyPositions[currentBlockPosition] === "undefined") {
            busyPositions[currentBlockPosition] = classIndex;
          }
          else {
            const superimposedClassesIndexes = this.getSuperimposedClassesIndexes(
              currentClass,
              classIndex,
              busyPositions
            );

            let withCanceledClasses = false;
            let withNormalClasses = false;

            for (const classe of superimposedClassesIndexes) {
              const superimposedClass = this.entries[classe];

              if (!withNormalClasses) {
                withNormalClasses = !(superimposedClass instanceof TimetableEntryLesson && superimposedClass.canceled);
              }

              if (!withCanceledClasses) {
                withCanceledClasses = superimposedClass instanceof TimetableEntryLesson && superimposedClass.canceled;
              }
            }

            if (withNormalClasses && withCanceledClasses) {
              for (const classe of superimposedClassesIndexes) {
                const superimposedClass = this.entries[classe];

                if (superimposedClass && superimposedClass instanceof TimetableEntryLesson && superimposedClass.canceled) {
                  invisible.add(superimposedClass);
                  return true;
                }
              }
            }

            break;
          }
        }
      }
    }

    return false;
  };
}
