export const isVersionGte2024_3_9 = ([major, minor, patch]: number[]): boolean => {
  if (major > 2024) return true;
  if (major < 2024) return false;

  if (minor > 3) return true;
  if (minor < 3) return false;

  return patch >= 9;
};
