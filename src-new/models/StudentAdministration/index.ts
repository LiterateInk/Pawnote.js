import { PageEmploiDuTemps } from "src-new/api/PageEmploiDuTemps";
import { Child } from "../Users/Parent";
import { User } from "../Users/User";
import { Student } from "../Users/Student";

export class StudentAdministration {
  /** @internal */
  public constructor(
    private readonly _user: User,
    private readonly _sub?: Child
  ) {}

  private get _resource(): Student | Child {
    if (this._user instanceof Student)
      return this._user;
    else return this._sub!;
  }

  public async getTimetableFromIntervals(start: Date, end?: Date) {
    const data = await new PageEmploiDuTemps(this._user.session, this._resource).sendIntervals(start, end);
  }

  public async getTimetableFromWeek(week: number) {
    const data = await new PageEmploiDuTemps(this._user.session, this._resource).sendWeekNumber(week);
  }
}
