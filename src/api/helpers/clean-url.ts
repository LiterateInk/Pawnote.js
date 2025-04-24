/**
 * Cleans a given URL by removing unwanted data and ensuring it has a consistent format.
 * @param url - The URL to clean.
 * @returns The cleaned URL.
 */
export const cleanURL = (url: string): string => {
  let pronoteURL = new URL(url);
  // Clean any unwanted data from URL.
  pronoteURL = new URL(`${pronoteURL.protocol}//${pronoteURL.host}${pronoteURL.pathname}`);

  // Clear the last path if we're not main selection menu.
  const paths = pronoteURL.pathname.split("/");
  if (paths[paths.length - 1].includes(".html")) {
    paths.pop();
  }

  // Rebuild URL with cleaned paths.
  pronoteURL.pathname = paths.join("/");

  // Return rebuilt URL without trailing slash.
  return pronoteURL.href.endsWith("/")
    ? pronoteURL.href.slice(0, -1)
    : pronoteURL.href;
};
