export const getArray = <T>(items: null | undefined | T | T[]): T[] => {
  return items
    ? Array.isArray(items)
      ? items
      : items instanceof URL
      ? []
      : [items]
    : [];
};
