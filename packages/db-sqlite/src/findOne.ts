import { SqliteDbAdapter } from '.';
import { AP, DbOptions } from '@activity-kit/types';
import { convertJsonToEntity } from '@activity-kit/utilities';

export async function findOne(
  this: SqliteDbAdapter,
  collection: string,
  matchingObject: Record<string, unknown>,
  options?: Array<keyof typeof DbOptions>,
): Promise<AP.Entity | null> {
  const [key] = Object.keys(matchingObject);
  const [keyValue] = Object.values(matchingObject);
  const value = await this.db.get(
    `SELECT * FROM ${collection} WHERE ${key} = ?${
      options && options.includes(DbOptions.CASE_INSENSITIVE)
        ? ' COLLATE NOCASE'
        : ''
    };`,
    keyValue,
  );

  if (!value) {
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

  return convertJsonToEntity(value) as AP.Entity;
}
