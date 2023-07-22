import { MongoDbAdapter } from '.';
import * as AP from '@activity-kit/types';
import { convertJsonToEntity } from '@activity-kit/utilities';
import { Db } from 'mongodb';

export async function findAll(
  this: MongoDbAdapter,
  collection: string,
  matchingObject: Record<string, unknown>,
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

  return value.map(convertJsonToEntity);
}
