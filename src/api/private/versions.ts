export const isVersionGte2024_3_9 = ([major, minor, patch]: number[]): boolean => {
  if (major > 2024) return true;
  if (major < 2024) return false;

  if (minor > 3) return true;
  if (minor < 3) return false;

  return patch >= 9;
};

export const isVersionGte2025_1_3 = ([major, minor, patch]: number[]): boolean => {
  if (major > 2025) return true;
  if (major < 2025) return false;

  if (minor > 1) return true;
  if (minor < 1) return false;

  return patch >= 3;
};
