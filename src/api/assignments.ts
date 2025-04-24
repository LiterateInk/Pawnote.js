import { type SessionHandle, type Assignment, TabLocation } from "~/models";
import { decodeAssignment } from "~/decoders/assignment";
import { homeworkFromIntervals, homeworkFromWeek } from "./private/homework";

const decoder = (session: SessionHandle, data: any): Array<Assignment> => {
  return data.ListeTravauxAFaire.V.map((homework: any) => decodeAssignment(homework, session));
};

/**
 * Fetches assignments for a specific week or range of weeks.
 * @param session - The current session handle.
 * @param weekNumber - The week number to fetch homework for.
 * @param extendsToWeekNumber - Optional, the week number to extend the range to.
 * @returns A promise that resolves to the assignments data.
 */
export const assignmentsFromWeek = async (session: SessionHandle, weekNumber: number, extendsToWeekNumber?: number): Promise<Array<Assignment>> => {
  const reply = await homeworkFromWeek(session, TabLocation.Assignments, weekNumber, extendsToWeekNumber);
  return decoder(session, reply);
};

/**
 * Fetches assignments for a specific range of dates.
 * @param session - The current session handle.
 * @param startDate - The start date of the range.
 * @param endDate - The end date of the range.
 * @returns A promise that resolves to the assignments data.
 */
export const assignmentsFromIntervals = async (session: SessionHandle, startDate: Date, endDate: Date): Promise<Array<Assignment>> => {
  const reply = await homeworkFromIntervals(session, TabLocation.Assignments, startDate, endDate);
  // Only keep items assignments are in the intervals.
  return decoder(session, reply).filter((homework) => startDate <= homework.deadline && homework.deadline <= endDate);
};
