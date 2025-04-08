import { GradeBook, GradeBookSubject } from "~/models/gradebook";
import { decodeSubject } from "./subject";
import { gradebookPDF } from "~/api";
import { PageUnavailableError, Period, SessionHandle } from "~/models";

/**
 * Decode the grade book from the response of PageBulletins.
 * @param {SessionHandle} session - The current session handle.
 * @param {Period} period - The current period.
 * @param {*} gradeBookData response from PageBulletins.
 * @returns {Promise<GradeBook>} The decoded grade book.
 */
export const decodeGradeBook = async (session: SessionHandle, period: Period, gradeBookData: any): Promise<GradeBook> => {
  // When bad period is used, the return is `{ data: {}, nom: 'PageBulletins' }` but the session don't expire.
  if (Object.keys(gradeBookData).length == 0 || gradeBookData.message)
    throw new PageUnavailableError();

  let overallAssessments: { name: string; value: string; }[] = gradeBookData.ObjetListeAppreciations.V.ListeAppreciations.V.map(
    (assessment: any) => {
      return { name: assessment.Intitule, value: assessment.L };
    }
  );
  const subjects = (gradeBookData.ListeServices.V as Array<any>).map(
    (subjectData) => {
      return {
        subject: decodeSubject(subjectData.Matiere?.V),
        subjectGroup: subjectData.SurMatiere.V,
        coef: parseInt(subjectData.Coefficient.V),

        averages: {
          student: parseFloat(subjectData.MoyenneEleve.V.replace(",", ".")),
          classOverall: parseFloat(subjectData.MoyenneClasse.V.replace(",", ".")),
          max: parseFloat(subjectData.MoyenneSup.V.replace(",", ".")),
          min: parseFloat(subjectData.MoyenneInf.V.replace(",", "."))
        },

        assessments: (subjectData.ListeAppreciations.V as Array<any>).map((a) => a.L),
        teachers: subjectData.ListeElements?.V.map((elem: any) => elem.ListeProfesseurs?.V.map((v: any) => v.L))
          ?? subjectData.ListeProfesseurs?.V.map((a: any) => a.L)
          ?? []
      } as GradeBookSubject;
    }
  );

  return {
    overallAssessments,
    graph: gradeBookData?.graphe?.replace("\\n", ""),
    subjects,
    url: await gradebookPDF(session, period)
  };
};
