import { assertIsObject } from 'activitypub-core-types';
import { D1DbAdapter } from '.';
import { D1Database } from '@cloudflare/workers-types';

type stringObjectFromDb = { _id: string };

function assertHasIdKey(value: unknown): asserts value is stringObjectFromDb {
  assertIsObject(value);

  if (!('_id' in value)) {
    throw new Error('Missing ID key');
  }
}

export async function findStringIdByValue(
  this: D1DbAdapter,
  dbCollection: string,
  value: string,
): Promise<string> {
  if (!(this.db instanceof D1Database)) {
    throw new Error('Bad database type.');
  }

  const one = await this.db
    .prepare(`SELECT * FROM ${dbCollection} WHERE value = ?;`)
    .bind(value)
    .first();

  if (!one) {
    return '';
  }

  try {
    assertHasIdKey(one);
  } catch (error) {
    return '';
  }

  if (!('_id' in one) || typeof one._id !== 'string') {
    return '';
  }

  return one._id;
}
