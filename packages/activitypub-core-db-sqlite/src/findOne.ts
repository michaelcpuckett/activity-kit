import { SqliteDbAdapter } from '.';
import { AP, DbOptions } from 'activitypub-core-types';
import { convertStringsToUrls } from 'activitypub-core-utilities';

export async function findOne(
  this: SqliteDbAdapter,
  collection: string,
  matchingObject: { [key: string]: unknown },
  options?: typeof DbOptions[keyof typeof DbOptions],
): Promise<AP.Entity | null> {
  const [key] = Object.keys(matchingObject);
  const [keyValue] = Object.values(matchingObject);
  const value = await this.db.get(
    `SELECT * FROM ${collection} WHERE ${key} = ?;`,
    keyValue,
  );

  if (!value) {
    return null;
  }

  for (const key of Object.keys(value)) {
    if (typeof value[key] === 'string' && value[key].startsWith('JSON:')) {
      value[key] = JSON.parse(value[key].slice('JSON:'.length));
    }
  }

  return convertStringsToUrls(value) as AP.Entity;
}
