import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import { Db } from 'mongodb';

export async function findAll(
  this: MongoDbAdapter,
  collection: string,
  matchingObject: { [key: string]: unknown },
): Promise<AP.Entity[] | null> {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }

  const cursor = this.db
    .collection(collection)
    .find(matchingObject, { projection: { _id: 0 } });

  const value = await cursor.toArray();

  if (!value) {
    return null;
  }

  return value as unknown as AP.Entity[];
}
