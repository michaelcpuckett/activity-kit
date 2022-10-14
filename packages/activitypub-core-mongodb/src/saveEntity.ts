import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
import { cleanProps, convertUrlsToStrings, getCollectionNameByUrl } from 'activitypub-core-utilities';

export async function saveEntity(this: MongoDatabase, entity: AP.Entity) {
  if (!entity.id) {
    throw new Error('No ID.');
  }

  const collectionName = getCollectionNameByUrl(entity.id);
  const _id = entity.id.toString();
  const convertedEntity = cleanProps(convertUrlsToStrings(entity));

  return await this.db.collection(collectionName).replaceOne(
    {
      _id,
    },
    convertedEntity,
    {
      upsert: true,
    },
  );
}
