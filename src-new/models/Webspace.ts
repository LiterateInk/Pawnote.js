import { UnreachableError } from "..";

export enum Webspace {
  SeniorManagement = 17,
  Teachers = 8,
  StudentAdministration = 14,
  Parents = 7,
  TeachingAssistants = 26,
  Students = 6,
  Company = 39
}

export namespace Webspace {
  const SENIOR_MANAGEMENT = "direction";
  const TEACHER = "professeur";
  const STUDENT_ADMINISTRATION = "viescolaire";
  const PARENT = "parent";
  const TEACHING_ASSISTANT = "accompagnant";
  const STUDENT = "eleve";
  const COMPANY = "entreprise";


  /**
   * @example
   * Webspace.fromPath("eleve.html"); // Webspace.Students
   * Webspace.fromPath("mobile.eleve.html"); // Webspace.Students
   */
  export function fromPath(path: string): Webspace {
    const segments = path.split(".");
    segments.pop(); // remove .html

    switch (segments.pop()) {
      case SENIOR_MANAGEMENT: return Webspace.SeniorManagement;
      case TEACHER: return Webspace.Teachers;
      case STUDENT_ADMINISTRATION: return Webspace.StudentAdministration;
      case PARENT: return Webspace.Parents;
      case TEACHING_ASSISTANT: return Webspace.TeachingAssistants;
      case STUDENT: return Webspace.Students;
      case COMPANY: return Webspace.Company;
      default: throw new UnreachableError("Webspace.fromPath");
    }
  }

  export function toMobilePath(webspace: Webspace): string {
    const wrap = (name: string) => `mobile.${name}.html`;

    switch(webspace) {
      case Webspace.SeniorManagement: return wrap(SENIOR_MANAGEMENT);
      case Webspace.Teachers: return wrap(TEACHER);
      case Webspace.StudentAdministration: return wrap(STUDENT_ADMINISTRATION);
      case Webspace.Parents: return wrap(PARENT);
      case Webspace.TeachingAssistants: return wrap(TEACHING_ASSISTANT);
      case Webspace.Students: return wrap(STUDENT);
      case Webspace.Company: return wrap(COMPANY);
    }
  }
}
