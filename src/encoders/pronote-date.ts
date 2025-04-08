/**
 * Encode a Date object to a pronote date format.
 * @param {Date} date - The date to encode.
 * @returns {string} A string formatted as `$d/$m/$yyyy $H:$M:$S`.
 * @example
 * encodePronoteDate(new Date());
 * // -> "21/1/2024 0:0:0"
 */
export const encodePronoteDate = (date: Date): string => {
  const day = date.getDate();
  const month = (date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
