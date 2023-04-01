import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import { D1Database } from '@cloudflare/workers-types';

export async function findAll(
  this: D1DbAdapter,
  collection: string,
  matchingObject: { [key: string]: unknown },
): Promise<AP.Entity[] | null> {
  if (!(this.db instanceof D1Database)) {
    throw new Error('Bad database type.');
  }

  const [key] = Object.keys(matchingObject);
  const [keyValue] = Object.values(matchingObject);

  const { results: value } = await this.db
    .prepare(`SELECT * FROM ${collection}${key ? ` WHERE ${key} = ?` : ''};`)
    .bind(keyValue)
    .all();

  if (!value) {
    return null;
  }

  return value as unknown as AP.Entity[];
}
