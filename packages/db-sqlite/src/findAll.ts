import { SqliteDbAdapter } from '.';
import * as AP from '@activity-kit/types';

export async function findAll(
  this: SqliteDbAdapter,
  collection: string,
  matchingObject: Record<string, unknown>,
): Promise<AP.Entity[] | null> {
  const [key] = Object.keys(matchingObject);
  const [keyValue] = Object.values(matchingObject);

  const value = await this.db.all.apply(this.db, [
    `SELECT * FROM ${collection}${key ? ` WHERE ${key} = ?` : ''};`,
    ...(keyValue ? [keyValue] : []),
  ]);

  if (!value) {
    return null;
  }

  return value as unknown as AP.Entity[];
}
