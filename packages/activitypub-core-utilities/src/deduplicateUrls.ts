export const deduplicateUrls = (unfilteredUrls: URL[]) => {
  return [...new Set(unfilteredUrls.map((url) => url.toString()))].map(
    (url) => new URL(url),
  );
};
