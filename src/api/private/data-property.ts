import type { SessionHandle } from "~/models";

const isVersionGte2024_3_9 = ([major, minor, patch]: number[]): boolean => {
  if (major > 2024) return true;
  if (major < 2024) return false;

  if (minor > 3) return true;
  if (minor < 3) return false;

  return patch >= 9;
};

export const dataProperty = (session: SessionHandle) => {
  // Since 2024.3.9(.0), the `donnees` property is called `data`.
  return isVersionGte2024_3_9(session.instance.version) ? "data" : "donnees";
};
