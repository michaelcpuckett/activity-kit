import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import {
  applyContext,
  cleanProps,
  convertUrlsToStrings,
  getCollectionNameByUrl,
} from 'activitypub-core-utilities';

export async function saveEntity(this: MongoDbAdapter, entity: AP.Entity) {
  if (!entity.id) {
    throw new Error('No ID.');
  }

  const collectionName = getCollectionNameByUrl(entity.id);
  const _id = entity.id.toString();
  const convertedEntity = cleanProps(
    convertUrlsToStrings(applyContext(entity)),
  );

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
