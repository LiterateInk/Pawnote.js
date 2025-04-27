import { AccountKind, UnreachableError } from "~/models";

/**
 * Decode the account kind from the path.
 * @param path mobile.eleve.html or eleve.html, both works.
 * @returns The account kind.
 */
export const decodeAccountKindFromPath = (path: string): AccountKind => {
  const segments = path.split(".");
  segments.pop(); // remove .html

  switch (segments.pop()) {
    case "eleve": return AccountKind.STUDENT;
    case "parent": return AccountKind.PARENT;
    case "professeur": return AccountKind.TEACHER;
    default: throw new UnreachableError("decodeAccountKindFromPath");
  }
};
