import { assertIsObject } from 'activitypub-core-types';
import { D1DbAdapter } from '.';
import { D1Database } from '@cloudflare/workers-types';

type stringObjectFromDb = { value: string };

function assertHasValueKey(
  value: unknown,
): asserts value is stringObjectFromDb {
  assertIsObject(value);

  if (!('value' in value)) {
    throw new Error('Missing value key');
  }
}

export async function findStringValueById(
  this: D1DbAdapter,
  dbCollection: string,
  _id: string,
): Promise<string> {
  if (!(this.db instanceof D1Database)) {
    throw new Error('Bad database type.');
  }

  const one = await this.db
    .prepare(`SELECT * FROM ${dbCollection} WHERE _id = ?;`)
    .bind(_id)
    .first();

  if (!one) {
    return '';
  }

  try {
    assertHasValueKey(one);
  } catch (error) {
    return '';
  }

  if (!('value' in one) || typeof one.value !== 'string') {
    return '';
  }

  return one.value;
}
