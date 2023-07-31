import * as AP from '@activity-kit/types';
import { cast, guard } from '@activity-kit/type-utilities';

/**
 * Converts an Entity to a plain JSON object.
 *
 * @returns The plain object.
 */
export function convertEntityToJson(
  object: AP.Entity,
): Record<string, unknown> {
  return cast.isPlainObject(convertObject(object)) ?? {};
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

  if (guard.isDate(value)) {
    return value.toISOString();
  }

  if (guard.isObject(value)) {
    return value.toString();
  }

  return value;
}
