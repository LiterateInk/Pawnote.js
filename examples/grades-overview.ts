import * as pronote from "../src";
import { credentials } from "./_credentials";

const handleGradeValue = (grade: pronote.GradeValue, outOf: number, coefficient: number): string => {
  // Handle custom grades.
  if (isNaN(grade.points)) {
    let message: string;
    switch (grade.kind) {
      case pronote.GradeKind.Absent:
        message = "Absent during this test.";
        break;
      case pronote.GradeKind.Unreturned:
        message = "Work not returned.";
        break;
      case pronote.GradeKind.Error:
        message = "Grade is not available.";
        break;
      default:
        throw new Error("Grade type not handled.");
    }

    return message;
  }
  // Otherwise, just print as is.
  else {
    return `${grade.points}/${outOf} (x${coefficient})`;
  }
};

void async function main () {
  const session = pronote.createSessionHandle();
  await pronote.loginCredentials(session, {
    url: credentials.pronoteURL,
    kind: pronote.AccountKind.STUDENT,
    username: credentials.username,
    password: credentials.password,
    deviceUUID: credentials.deviceUUID
  });

  const tab = session.userResource.tabs.get(pronote.TabLocation.Grades);
  if (!tab) throw new Error("Cannot retrieve periods for the grades tab, you maybe don't have access to it.");
  const selectedPeriod = tab.defaultPeriod!;

  console.log("Available periods for this tab ->", tab.periods.map((period) => period.name).join(", "));
  console.log("We selected the default period,", selectedPeriod.name, "!\n");

  const overview = await pronote.gradesOverview(session, selectedPeriod);

  console.group("--- GRADES ---\n");

  overview.grades.forEach((grade) => {
    console.log(grade.subject.name, ":", grade.comment || "(no description)");
    console.log("Registered the", grade.date.toLocaleString(), "//", selectedPeriod.name);

    if (typeof grade.outOf.points === "number") {
      if (grade.isOutOf20)
        console.log("-> Grade was transformed to be out of 20.");
      if (grade.isBonus)
        console.log("-> Grade is a bonus, only counted if value is above 10.");
      if (grade.isOptional)
        console.log("-> Grade is optional, only counted if value increases the student's average.");

      console.log("Grade:  ", handleGradeValue(grade.value, grade.outOf.points, grade.coefficient));
      if (grade.average) console.log("Average:", handleGradeValue(grade.average, grade.outOf.points, grade.coefficient));
      if (grade.min) console.log("Minimum:", handleGradeValue(grade.min, grade.outOf.points, grade.coefficient));
      if (grade.max) console.log("Maximum:", handleGradeValue(grade.max, grade.outOf.points, grade.coefficient));
      if (grade.commentaireSurNote) {
        console.log("Note on grade:", grade.commentaireSurNote);
      }
      if (grade.subjectFile) console.log("Subject:", grade.subjectFile.name, "=>", grade.subjectFile.url);
      if (grade.correctionFile) console.log("Correction:", grade.correctionFile.name, "=>", grade.correctionFile.url);
    }
    else {
      console.log("Grade doesn't have a valid 'outOf', shouldn't be counted.");
      console.log(grade.outOf);
    }

    // Break line for next entry.
    console.log();
  });

  console.groupEnd();

  console.group("--- AVERAGES ---\n");

  overview.subjectsAverages.forEach((average) => {
    console.log("->", average.subject.name);
    console.log("Student:", average.student);
    console.log("Class:", average.class_average ?? "(not available)");
    console.log("Max:", average.max ?? "(not available)");
    console.log("Min:", average.min ?? "(not available)");

    // Break line for next entry.
    console.log();
  });

  console.groupEnd();

  console.group("--- GLOBAL AVERAGE ---\n");

  console.log("Student:", overview.overallAverage ?? "(not available)");
  console.log("Class:", overview.classAverage ?? "(not available)");

  console.groupEnd();
}();
