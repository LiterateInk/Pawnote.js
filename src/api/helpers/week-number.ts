import { getUTCTime } from "~/api/private/dates";

/**
 * Calculates the week number based on a given date and a start date.
 * @param dateToTranslate - The date to translate into a week number.
 * @param startDay - The start date from which to calculate the week number.
 * @returns The calculated week number.
 */
export const translateToWeekNumber = (dateToTranslate: Date, startDay: Date): number => {
  const daysDiff = Math.floor((getUTCTime(dateToTranslate) - getUTCTime(startDay)) / (1000 * 60 * 60 * 24));
  return 1 + Math.floor(daysDiff / 7);
};
