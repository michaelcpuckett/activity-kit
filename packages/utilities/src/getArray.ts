export const getArray = <T>(items: null | undefined | T | T[]): T[] => {
  if (!items) {
    return [];
  }

  return Array.isArray(items) ? items : [items];
};
