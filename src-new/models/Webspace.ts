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
  /**
   * @example
   * Webspace.fromPath("eleve.html"); // Webspace.Students
   * Webspace.fromPath("mobile.eleve.html"); // Webspace.Students
   */
  export function fromPath(path: string): Webspace {
    const segments = path.split(".");
    segments.pop(); // remove .html

    switch (segments.pop()) {
      case "direction": return Webspace.SeniorManagement;
      case "professeur": return Webspace.Teachers;
      case "viescolaire": return Webspace.StudentAdministration;
      case "parent": return Webspace.Parents;
      case "accompagnant": return Webspace.TeachingAssistants;
      case "eleve": return Webspace.Students;
      case "entreprise": return Webspace.Company;
      default: throw new UnreachableError("Webspace.fromPath");
    }
  }
}
