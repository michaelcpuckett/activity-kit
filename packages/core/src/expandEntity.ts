import * as AP from '@activity-kit/types';
import { cast, guard } from '@activity-kit/type-utilities';

import { CoreLibrary } from '.';

/**
 * Keys that should not be expanded.
 */
const selfReferentialKeys = [
  '@context',
  '_id',
  'id',
  'type',
  'url',
  'href',
  'publicKey',
];

/**
 * Convert an Entity to a full object, expanding any references to other
 * Entities.
 *
 * @returns A Promise that resolves to the expanded Entity.
 */
export async function expandEntity(
  this: CoreLibrary,
  entity: AP.Entity,
): Promise<AP.Entity> {
  return cast.isApEntity(await expandObject.bind(this)(entity)) ?? entity;
}

/**
 * Expand all references in an object.
 *
 * @returns A Promise that resolves to an object with all references expanded.
 */
async function expandObject(
  this: CoreLibrary,
  object: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const expanded: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    expanded[key] = await expandEntry.bind(this)([key, value]);
  }

  return expanded;
}

/**
 * Expand a single entry in an object, which may be a reference to another
 * Entity.
 *
 * @returns A Promise that resolves to the expanded entry in the object.
 */
async function expandEntry(
  this: CoreLibrary,
  entry: [key: string, value: unknown],
): Promise<unknown> {
  const [key, value] = entry;

  if (selfReferentialKeys.includes(key)) {
    return value;
  }

  if (guard.isArray(value)) {
    return await Promise.all(
      value.map(async (item) => await expandEntry.bind(this)([key, item])),
    );
  }

  if (guard.isPlainObject(value)) {
    return await expandObject.bind(this)(value);
  }

  if (guard.isUrl(value)) {
    const foundEntity = cast.isApEntity(await this.queryById(value));

    if (foundEntity) {
      return foundEntity;
    }
  }

  return value;
}
