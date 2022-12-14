import { MongoDbAdapter } from '.';
import { AP, DbOptions } from 'activitypub-core-types';
import {
  convertStringsToUrls
} from 'activitypub-core-utilities';

export async function findOne(
  this: MongoDbAdapter,
  collection: string,
  matchingObject: { [key: string]: unknown },
  options?: typeof DbOptions[keyof typeof DbOptions]
): Promise<AP.Entity | null> {
  let value = null;

  if (options && options.includes(DbOptions.CASE_INSENSITIVE)) {
    const cursor = this.db.collection(collection).find(matchingObject).collation({ locale: 'en', strength: 1 });
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

  return convertStringsToUrls(value) as AP.Entity;
}
