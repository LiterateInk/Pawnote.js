import { Attachment } from "./attachment";
import { GradeValue } from "./grade-value";
import { Subject } from "./subject";

export type Grade = Readonly<{
  /** the id of the grade (used internally) */
  id: string;
  /** the actual grade */
  value: GradeValue;
  /** the maximum amount of points */
  outOf: GradeValue;
  /** the default maximum amount of points */
  defaultOutOf?: GradeValue;
  /** the date on which the grade was given */
  date: Date;
  /** the subject in which the grade was given */
  subject: Subject;
  /** the average of the class */
  average?: GradeValue;
  /** the highest grade */
  max?: GradeValue;
  /** the lowest grade */
  min?: GradeValue;
  /** the coefficient of the grade */
  coefficient: number;
  /** comment on the grade description */
  comment: string;
  /** note on the grade */
  commentaireSurNote?: string;
  /** is the grade bonus : only points above 10 count */
  isBonus: boolean;
  /** is the grade optional : the grade only counts if it increases the average */
  isOptional: boolean;
  /** is the grade out of 20. Example 8/10 -> 16/20 */
  isOutOf20: boolean;
  /** the file of the subject */
  subjectFile?: Attachment;
  /** the file of the correction */
  correctionFile?: Attachment;
}>;
