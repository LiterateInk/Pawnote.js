import type { SessionHandle } from "~/models";

/**
 * Generate the iCal URL for the timetable.
 * @param {SessionHandle} session - The current session handle.
 * @param {string} iCalToken - The iCal token for the session.
 * @param {string} fileName - The name of the iCal file. Default is "timetable".
 * @returns {string} The iCal URL for the timetable.
 */
export const timetableICalURL = (session: SessionHandle, iCalToken: string, fileName: string = "timetable"): string => {
  const version = session.instance.version.join(".");
  return `${session.information.url}/ical/${fileName}.ics?icalsecurise=${iCalToken}&version=${version}&param=266f3d32`;
};
