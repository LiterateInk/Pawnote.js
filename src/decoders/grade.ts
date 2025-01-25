import { AttachmentKind, type SessionHandle, type Grade } from "~/models";
import { decodePronoteDate } from "./pronote-date";
import { decodeGradeValue } from "./grade-value";
import { decodeAttachment } from "./attachment";
import { decodeSubject } from "./subject";

export const decodeGrade = (grade: any, session: SessionHandle): Grade => {
  const id = grade.N;
  const isBonus = grade.estBonus;

  const attachment = (key: string, genre: string) => grade[key] && decodeAttachment({
    G: AttachmentKind.File,
    L: grade[key],
    N: id
  }, session, { G: genre });

  return {
    id,
    value: decodeGradeValue(grade.note.V),
    outOf: decodeGradeValue(grade.bareme.V),
    defaultOutOf: decodeGradeValue(grade.baremeParDefaut.V),
    date: decodePronoteDate(grade.date.V),
    subject: decodeSubject(grade.service.V),
    average: grade.moyenne && decodeGradeValue(grade.moyenne.V),
    max: grade.noteMax && decodeGradeValue(grade.noteMax.V),
    min: grade.noteMin && decodeGradeValue(grade.noteMin.V),
    coefficient: grade.coefficient,
    comment: grade.commentaire,
    commentaireSurNote: grade.commentaireSurNote,
    isBonus,
    isOptional: grade.estFacultatif && !isBonus,
    isOutOf20: grade.estRamenerSur20,
    subjectFile: attachment("libelleSujet", "DevoirSujet"),
    correctionFile: attachment("libelleCorrige", "DevoirCorrige")
  };
};
