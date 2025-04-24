import type { SessionHandle, WeekFrequency } from "~/models";

/**
 * Get the frequency of a week.
 * @param session - The current session handle.
 * @param weekNumber - The week number to get the frequency for.
 * @returns The frequency of the week or undefined if not found.
 */
export const frequency = (session: SessionHandle, weekNumber: number): WeekFrequency | undefined => {
  return session.instance.weekFrequencies.get(weekNumber);
};
