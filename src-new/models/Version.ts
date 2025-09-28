export type Version = Array<number>;

export namespace Version {
  /** @returns true if the version is >= 2024.3.9 */
  export function isGreaterThanOrEqualTo202439([major, minor, patch]: Version): boolean {
    if (major > 2024) return true;
    if (major < 2024) return false;

    if (minor > 3) return true;
    if (minor < 3) return false;

    return patch >= 9;
  }

  /** @returns true if the version is >= 2025.1.3 */
  export function isGreaterThanOrEqualTo202513([major, minor, patch]: Version): boolean {
    if (major > 2025) return true;
    if (major < 2025) return false;

    if (minor > 1) return true;
    if (minor < 1) return false;

    return patch >= 3;
  }
}
