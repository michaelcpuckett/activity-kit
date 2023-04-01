import { D1DbAdapter } from '.';
import { AP, assertIsObject, DbOptions } from 'activitypub-core-types';
import { convertStringsToUrls } from 'activitypub-core-utilities';
import { D1Database } from '@cloudflare/workers-types';

type stringObjectFromDb = { _id: string };

function assertHasIdKey(value: unknown): asserts value is stringObjectFromDb {
  assertIsObject(value);

  if (!('_id' in value)) {
    throw new Error('Missing ID key');
  }
}

export async function findOne(
  this: D1DbAdapter,
  collection: string,
  matchingObject: { [key: string]: unknown },
  options?: Array<keyof typeof DbOptions>,
): Promise<AP.Entity | null> {
  if (!(this.db instanceof D1Database)) {
    throw new Error('Bad database type.');
  }

  const [key] = Object.keys(matchingObject);
  const [keyValue] = Object.values(matchingObject);

  const value = await this.db
    .prepare(`SELECT * FROM ${collection} WHERE ${key} = ?;`)
    .bind(keyValue)
    .first();

  try {
    assertHasIdKey(value);
  } catch (error) {
    return null;
  }

  if ('_id' in value && value._id) {
    delete value._id;
  }

  for (const key of Object.keys(value)) {
    // All fields come back, even if they are null.
    if (value[key] === null) {
      delete value[key];
    } else if (['manuallyApprovesFollowers', 'sensitive'].includes(key)) {
      // Convert from number (INTEGER) to boolean.
      value[key] = value[key] === 1 ? true : false;
    } else if (
      typeof value[key] === 'string' &&
      value[key].startsWith('JSON:')
    ) {
      // Convert to object when prefixed with 'JSON:'.
      value[key] = JSON.parse(value[key].slice('JSON:'.length));
    }
  }

  return convertStringsToUrls(
    value as unknown as { [key: string]: string },
  ) as AP.Entity;
}
