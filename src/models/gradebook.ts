import { Subject } from "./subject";

export type GradeBook = Readonly<{
  message?: string;
  /**
   * The differents assessments like the mentions or the overall rating
   */
  overallAssessments: {
    name: string;
    value: string;
  }[];
  /**
   * graph image as base64 png (with white backgound)
   */
  graph?: string;
  subjects: GradeBookSubject[];
  url: string;
}>;

export type GradeBookSubject = {
  subject: Subject;
  subjectGroup: string;
  coef: number;
  averages: {
    student: number;
    classOverall: number;
    max: number;
    min: number;
  };
  assessments: string[];
  teachers: string[];
};
