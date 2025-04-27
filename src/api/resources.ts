import { type SessionHandle, TabLocation, type Resource } from "~/models";
import { homeworkFromWeek, homeworkFromIntervals } from "./private/homework";
import { decodeResource } from "~/decoders/resource";

const decoder = (session: SessionHandle, data: any): Array<Resource> => {
  return data.ListeCahierDeTextes.V.map((resource: any) => decodeResource(resource, session));
};

/**
 * Get the resources from a specific week.
 * @param session - The current session handle.
 * @param weekNumber - The week number to get resources from.
 * @param extendsToWeekNumber - The week number to extend the search to (optional).
 * @returns A promise that resolves to an array of resources.
 */
export const resourcesFromWeek = async (session: SessionHandle, weekNumber: number, extendsToWeekNumber?: number): Promise<Resource[]> => {
  const reply = await homeworkFromWeek(session, TabLocation.Resources, weekNumber, extendsToWeekNumber);
  return decoder(session, reply);
};

/**
 * Get the resources from a specific date range.
 * @param session - The current session handle.
 * @param startDate - The start date of the range.
 * @param endDate - The end date of the range.
 * @returns A promise that resolves to an array of resources.
 */
export const resourcesFromIntervals = async (session: SessionHandle, startDate: Date, endDate: Date): Promise<Resource[]> => {
  const reply = await homeworkFromIntervals(session, TabLocation.Resources, startDate, endDate);
  return decoder(session, reply).filter((lesson) => startDate <= lesson.endDate && lesson.endDate <= endDate);
};
