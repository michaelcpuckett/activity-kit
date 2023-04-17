import { AP, assertIsApEntity } from '@activity-kit/types';

export function compressEntity(entity: AP.Entity): AP.Entity | null {
  const object: Record<string, unknown> = {};

  for (const key of Object.keys(entity)) {
    if (typeof key === 'string') {
      object[key] = entity[key];
    }
  }

  const compressed = compressObject(object);

  try {
    assertIsApEntity(compressed);
    return compressed;
  } catch (error) {
    return null;
  }
}

function compressObject(object: Record<string, unknown>) {
  const compressed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    compressed[key] = compressItem(value);
  }

  return compressed;
}

function compressItem(item: unknown): unknown {
  if (item instanceof URL || item instanceof Date || typeof item === 'string') {
    return item;
  } else if (Array.isArray(item)) {
    return item.map(compressItem);
  } else if (item && typeof item === 'object') {
    if ('id' in item && item.id instanceof URL) {
      return item.id;
    } else if ('href' in item && item.href instanceof URL) {
      return item.href;
    } else if ('url' in item) {
      if (item.url instanceof URL) {
        return item.url;
      } else if (
        typeof item.url === 'object' &&
        'href' in item.url &&
        item.url.href instanceof URL
      ) {
        return item.url.href;
      } else {
        return item;
      }
    } else {
      const object: Record<string, unknown> = {};

      for (const objectKey of Object.keys(item)) {
        if (typeof objectKey === 'string') {
          object[objectKey] = item[objectKey];
        }
      }

      return compressObject(object);
    }
  } else {
    return item;
  }
}
