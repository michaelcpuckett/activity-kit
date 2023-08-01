/**
 * Removes duplicate URLs from an array of URLs.
 *
 * @returns An array of unique URLs.
 */
export const deduplicateUrls = (unfilteredUrls: URL[]) => {
  return [...new Set(unfilteredUrls.map((url) => url.toString()))].map(
    (url) => new URL(url),
  );
};
