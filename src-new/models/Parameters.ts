import { FonctionParametresResponse } from "~/api/FonctionParametres";
import { JourFerie } from "~/api/FonctionParametres/response";
import { Periode } from "~/api/models/Periode";
import { getTimeUTC } from "~/core/date";

export class Parameters {
  /** @internal */
  public constructor(
    private readonly parameters: FonctionParametresResponse
  ) {}

  public get navigatorIdentifier(): string | null {
    return this.parameters.data.navigatorIdentifier;
  }

  public get slotsPerDay(): number {
    return this.parameters.data.general.placesParJour;
  }

  public get nextBusinessDay(): Date {
    return this.parameters.data.general.jourOuvre;
  }

  public get firstMonday(): Date {
    return this.parameters.data.general.premierLundi;
  }

  public get firstDate(): Date {
    return this.parameters.data.general.premiereDate;
  }

  public get lastDate(): Date {
    return this.parameters.data.general.derniereDate;
  }

  /**
   * An array of formatted hours indicating the end of slots.
   * @example ["08h00", "08h30"]
   */
  public get endings(): Array<string> {
    return this.parameters.data.general.listeHeuresFin.map(
      (heure) => heure.label
    );
  }

  public get periods(): Array<Period> {
    return this.parameters.data.general.listePeriodes.map(
      (periode) => new Period(periode)
    );
  }

  public get holidays(): Array<Holiday> {
    return this.parameters.data.general.listeJoursFeries.map(
      (ferie) => new Holiday(ferie)
    );
  }

  public get weekFrequencies(): Map<number, WeekFrequency> {
    const frequencies = new Map();

    for (const frequency of [1, 2]) {
      const weeks = this.parameters.data.general.domainesFrequences[frequency];
      for (const week of weeks) {
        frequencies.set(week, new WeekFrequency(this.parameters, frequency));
      }
    }

    return frequencies;
  }

  /**
   * Calculates the week number of the given based on the instance first monday.
   * @param date to translate into week number
   */
  public dateToWeekNumber(date: Date): number {
    const diff = Math.floor((getTimeUTC(date) - getTimeUTC(this.firstMonday)) / (1000 * 60 * 60 * 24));
    return 1 + Math.floor(diff / 7);
  }
}

export class WeekFrequency {
  public label: string;

  /**
   * @internal
   */
  public constructor(
    parameters: FonctionParametresResponse,
    public readonly frequency: number
  ) {
    this.label = parameters.data.general.libellesFrequences[frequency];
  }
}

export class Holiday {
  public constructor (ferie: JourFerie) {
    // TODO !
    // id: holiday.N,
    // name: holiday.L,
    // startDate: decodePronoteDate(holiday.dateDebut.V),
    // endDate: decodePronoteDate(holiday.dateFin.V)
  }
}

export class Period {
  public constructor(
    private readonly periode: Periode
  ) {}

  public get id() {
    return this.periode.n;
  }
  public get kind() {
    return this.periode.g;
  }
  public get name() {
    return this.periode.l;
  }
  public get startDate(): Date {
    return this.periode.dateDebut;
  }
  public get endDate(): Date {
    return this.periode.dateFin;
  }
}
