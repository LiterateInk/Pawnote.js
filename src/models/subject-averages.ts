import type { GradeValue } from "./grade-value";
import type { Subject } from "./subject";

export type SubjectAverages = Readonly<{
  /** students average in the subject */
  student?: GradeValue;
  /** classes average in the subject */
  class_average?: GradeValue;
  /** highest average in the class */
  max?: GradeValue;
  /** lowest average in the class */
  min?: GradeValue;
  /** maximum amount of points */
  outOf?: GradeValue;
  /** the default maximum amount of points */
  defaultOutOf?: GradeValue;
  /** subject the average is from */
  subject: Subject;
  /** background color of the subject */
  backgroundColor: string;
}>;
