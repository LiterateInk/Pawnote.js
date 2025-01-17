import * as pronote from "../src";
import { credentials } from "./_credentials";
import { GradeBook } from "~/models/gradebook";

void async function main() {
  const session = pronote.createSessionHandle();
  await pronote.loginCredentials(session, {
    url: credentials.pronoteURL,
    kind: pronote.AccountKind.STUDENT,
    username: credentials.username,
    password: credentials.password,
    deviceUUID: credentials.deviceUUID
  });
  const tab = session.userResource.tabs.get(pronote.TabLocation.Gradebook);
  if (!tab) throw new Error("Cannot retrieve periods for the grades tab, you maybe don't have access to it.");
  const selectedPeriod = tab.defaultPeriod!;

  console.log("Available periods for this tab ->", tab.periods.map((period) => period.name).join(", "));
  console.log("We selected the default period,", selectedPeriod.name, "!\n");

  let gradebook: GradeBook;
  try {
    gradebook = await pronote.gradebook(session, selectedPeriod);
  }
  catch (error) {
    console.error("The period is not accesibles");
    throw error;
  }

  console.group("--- Subjects ---");

  gradebook.subjects.forEach(
    (subject) => {
      console.group(subject.subject.name, ":", subject.teachers.join(", "));
      console.log("Coef:", subject.coef);
      console.group("Averages:");
      console.log("Student:", subject.averages.student);
      console.log("Class overall:", subject.averages.classOverall);
      console.log("Max:", subject.averages.max);
      console.log("Min:", subject.averages.min);
      console.groupEnd(); // Averages
      console.group("Assessment" + (subject.assessments.length > 1 ? "s: " : ": "));
      subject.assessments.forEach((a) => console.log(a));
      console.groupEnd(); // Assessments
      console.groupEnd(); // Subject
    }
  );
  console.groupEnd(); // Subjects
  console.log(); // Make space between categories

  console.group("--- Overall ---");
  console.group("Assessment" + (gradebook.overallAssessments.length > 1 ? "s :" : " :"));
  gradebook.overallAssessments.forEach((a) => console.log(a.name, ":", a.value));
  console.groupEnd(); // Assessments
  console.groupEnd(); // Overall
}();
