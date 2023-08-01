import * as AP from '@activity-kit/types';
import { cast, guard } from '@activity-kit/type-utilities';

/**
 * Converts an Entity to a plain JSON object.
 *
 * This is needed to store the Entity in a database or send it over the network,
 * as the Entity may contain URLs, Dates, and other non-JSON values.
 *
 * @returns The plain object.
 *
 * @todo The fallthrough case for objects relies on the `toString()` method.
 * This is not ideal, as it may not always produce the desired result.
 */
export function convertEntityToJson(
  object: AP.Entity,
): Record<string, unknown> {
  return cast.isPlainObject(convertObject(object)) ?? {};
}

/**
 * Converts an object to a plain JSON object.
 *
 * @returns The plain object.
 */
function convertObject(
  object: Record<string, unknown>,
): Record<string, unknown> {
  const converted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    converted[key] = convertUnknown(value);
  }

  return converted;
}

/**
 * Converts an unknown value to a plain JSON value.
 *
 * @returns The plain value.
 */
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
