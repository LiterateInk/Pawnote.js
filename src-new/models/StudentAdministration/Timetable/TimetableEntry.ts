import { Cours } from "~/api/PageEmploiDuTemps/response";
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
