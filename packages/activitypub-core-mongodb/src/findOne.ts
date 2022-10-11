import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
import { convertStringsToUrls } from 'activitypub-core-utilities';

export async function findOne(
  this: MongoDatabase,
  collection: string,
  matchingObject: { [key: string]: unknown },
): Promise<AP.Entity | null> {
  const value = await this.db.collection(collection).findOne(matchingObject);

  if (!value) {
    return null;
  }

  delete (value as Partial<typeof value>)._id;

  const foundEntity = convertStringsToUrls(value) as AP.Entity;

  const entityWithType: {
    [key: string]: unknown;
    type: typeof AP.AllTypes[keyof typeof AP.AllTypes];
  } = {
    ...foundEntity,
    type: foundEntity.type as typeof AP.AllTypes[keyof typeof AP.AllTypes],
  };

  for (const type of Object.values(AP.AllTypes)) {
    if (type === entityWithType.type) {
      return entityWithType as AP.Entity;
    }
  }

  return null;
}
