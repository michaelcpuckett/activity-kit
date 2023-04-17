import { MongoDbAdapter } from '.';
import { AP, DbOptions } from '@activity-kit/types';
import { convertJsonToEntity } from '@activity-kit/utilities';
import { Db } from 'mongodb';

export async function findOne(
  this: MongoDbAdapter,
  collection: string,
  matchingObject: Record<string, unknown>,
  options?: Array<keyof typeof DbOptions>,
): Promise<AP.Entity | null> {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }

  let value = null;

  if (options && options.includes(DbOptions.CASE_INSENSITIVE)) {
    const cursor = this.db
      .collection(collection)
      .find(matchingObject)
      .collation({ locale: 'en', strength: 1 });
    const results = await cursor.toArray();

    if (results.length) {
      value = results[0];
    }
  }

  if (!value) {
    value = await this.db.collection(collection).findOne(matchingObject);
  }

  if (!value) {
    return null;
  }

  delete (value as Partial<typeof value>)._id;

  return convertJsonToEntity(value) as AP.Entity;
}
