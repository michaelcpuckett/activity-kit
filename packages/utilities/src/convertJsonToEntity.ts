import * as AP from '@activity-kit/types';
import { cast, guard } from '@activity-kit/type-utilities';
import { PUBLIC_ACTOR } from './globals';

export function convertJsonToEntity(
  object: Record<string, unknown>,
): AP.Entity | null {
  return cast.isApEntity(convertObject(object)) ?? null;
}

function convertObject(
  object: Record<string, unknown>,
): Record<string, unknown> {
  const converted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    converted[key] = convertUnknown(value);
  }

  return converted;
}

function convertUnknown(value: unknown): unknown {
  if (!guard.exists(value)) {
    return value;
  }

  if (guard.isArray(value)) {
    return value.map(convertUnknown);
  }

  if (guard.isPlainObject(value)) {
    return convertObject(value);
  }

  if (guard.isString(value)) {
    if (value === 'as:Public') {
      return new URL(PUBLIC_ACTOR);
    }

    try {
      if (value.startsWith('http')) {
        return new URL(value);
      } else {
        const date = Date.parse(value);

        if (!Number.isNaN(date)) {
          return new Date(date);
        }

        return value;
      }
    } catch (error) {
      return value;
    }
  }

  return value;
}
