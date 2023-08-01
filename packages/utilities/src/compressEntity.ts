import * as AP from '@activity-kit/types';
import { cast, guard } from '@activity-kit/type-utilities';

/**
 * Compresses an Entity by replacing all nested Entities with their URLs.
 *
 * This is useful for storing Entities in a database, as it removes the need to
 * store the entire Entity, or for sending Entities over the network, as it
 * reduces the size of the payload.
 *
 * @note This follows rules similar to JSON-LD compaction, but it does not
 * follow the JSON-LD spec exactly. For example, it does not use the `@context`
 * property to determine the full URL of a property.
 *
 * @returns The compressed Entity, or null if not an Entity.
 */
export function compressEntity(entity: AP.Entity): AP.Entity | null {
  return cast.isApEntity(compressObject(entity)) ?? null;
}

/**
 * Compresses an object by replacing all nested Entities with their URLs.
 *
 * @returns The compressed object.
 */
function compressObject(
  object: Record<string, unknown>,
): Record<string, unknown> {
  const compressed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    compressed[key] = compressUnknown(value);
  }

  return compressed;
}

/**
 * Compresses an unknown value by replacing all nested Entities with their
 * URLs.
 *
 * @returns The compressed value.
 */
function compressUnknown(item: unknown): unknown {
  if (!guard.exists(item)) {
    return item;
  }

  if (guard.isArray(item)) {
    return item.map(compressUnknown);
  }

  const entity = cast.isApEntity(item);

  if (!entity) {
    return item;
  }

  if ('id' in entity && guard.isUrl(entity.id)) {
    return entity.id;
  }

  if ('url' in entity && guard.isUrl(entity.url)) {
    return entity.url;
  }

  if ('href' in entity && guard.isUrl(entity.href)) {
    return entity.href;
  }

  return entity;
}
