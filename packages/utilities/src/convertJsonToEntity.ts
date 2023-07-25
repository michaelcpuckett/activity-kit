import * as AP from '@activity-kit/types';
import { cast } from '@activity-kit/type-utilities';
import { PUBLIC_ACTOR } from './globals';

export function convertJsonToEntity(
  object: Record<string, unknown>,
): AP.Entity | null {
  const converted = convertObject(object);

  return cast.isApEntity(converted) ?? null;
}

function convertObject(object: Record<string, unknown>) {
  const converted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    converted[key] = convertItem(value);
  }

  return converted;
}

function convertItem(item: unknown): unknown {
  if (item instanceof URL || item instanceof Date) {
    return item;
  } else if (typeof item === 'string') {
    if (item === 'as:Public') {
      return new URL(PUBLIC_ACTOR);
    }

    try {
      if (item.startsWith('http')) {
        return new URL(item);
      } else {
        const date = Date.parse(item);

        if (!Number.isNaN(date)) {
          return new Date(date);
        }

        return item;
      }
    } catch (error) {
      return item;
    }
  } else if (Array.isArray(item)) {
    return item.map(convertItem);
  } else if (item && typeof item === 'object') {
    const object: Record<string, unknown> = {};

    for (const objectKey of Object.keys(item)) {
      if (typeof objectKey === 'string') {
        object[objectKey] = item[objectKey];
      }
    }

    return convertObject(object);
  } else {
    return item;
  }
}
