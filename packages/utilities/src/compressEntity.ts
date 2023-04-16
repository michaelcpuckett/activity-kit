import { AP } from '@activity-kit/types';

export function compressEntity(entity: AP.Entity): AP.Entity {
  const compressed: { [key: string]: unknown } = { ...entity };

  for (const [key, value] of Object.entries(entity)) {
    if (
      value instanceof URL ||
      value instanceof Date ||
      typeof value === 'string'
    ) {
      continue;
    } else if (Array.isArray(value)) {
      compressed[key] = compressArray(value);
    } else if (
      value &&
      typeof value === 'object' &&
      'id' in value &&
      value.id instanceof URL
    ) {
      compressed[key] = value.id;
    } else {
      continue;
    }
  }

  return compressed as AP.Entity;
}

function compressArray(array: any[]) {
  return array.map((item) => {
    if (
      item instanceof URL ||
      item instanceof Date ||
      typeof item === 'string'
    ) {
      return item;
    } else if (Array.isArray(item)) {
      return compressArray(item);
    } else if (
      typeof item === 'object' &&
      'id' in item &&
      item.id instanceof URL
    ) {
      return item.id;
    } else {
      return item;
    }
  });
}
