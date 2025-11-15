import { PageEmploiDuTemps } from "~/api/PageEmploiDuTemps";
import { Child } from "../Users/Parent";
import { User } from "../Users/User";
import { Student } from "../Users/Student";
import { Timetable } from "./Timetable";

export class StudentAdministration {
  /** @internal */
  public constructor(
    private readonly user: User,
    private readonly sub?: Child
  ) {}

  private get resource(): Student | Child {
    if (this.user instanceof Student)
      return this.user;
    else return this.sub!;
  }

  public async getTimetableFromIntervals(start: Date, end?: Date): Promise<Timetable> {
    return new Timetable(
      this.user.parameters,
      await new PageEmploiDuTemps(this.user.session, this.resource)
        .sendIntervals(start, end)
    );
  }

  public async getTimetableFromWeek(week: number): Promise<Timetable> {
    return new Timetable(
      this.user.parameters,
      await new PageEmploiDuTemps(this.user.session, this.resource)
        .sendWeekNumber(week)
    );
  }
}
