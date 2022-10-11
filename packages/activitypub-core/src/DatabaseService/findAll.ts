import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types';

export async function findAll(
  this: DatabaseService,
  collection: string,
  matchingObject: { [key: string]: unknown },
): Promise<AP.Entity[] | null> {
  const cursor = this.db
    .collection(collection)
    .find(matchingObject, { projection: { _id: 0 } });

  const value = await cursor.toArray();

  if (!value) {
    return null;
  }

  return value as unknown as AP.Entity[];
}
