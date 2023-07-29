import * as AP from '@activity-kit/types';
import { cast, guard } from '@activity-kit/type-utilities';

import { CoreLibrary } from './adapters';

const selfReferentialKeys = [
  '@context',
  '_id',
  'id',
  'type',
  'url',
  'href',
  'publicKey',
];

export async function expandEntity(
  this: CoreLibrary,
  entity: AP.Entity,
): Promise<AP.Entity | null> {
  return cast.isApEntity(await expandObject.bind(this)(entity)) ?? null;
}

async function expandObject(
  this: CoreLibrary,
  object: Record<string, unknown>,
) {
  const expanded: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    expanded[key] = await expandEntry.bind(this)([key, value]);
  }

  return expanded;
}

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
