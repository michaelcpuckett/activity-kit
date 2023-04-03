import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import { Db } from 'mongodb';
import {
  applyContext,
  cleanProps,
  convertUrlsToStrings,
  getCollectionNameByUrl,
} from 'activitypub-core-utilities';

export async function saveEntity(
  this: MongoDbAdapter,
  entity: AP.Entity,
): Promise<void> {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }

  if (!entity.id) {
    throw new Error('No ID.');
  }

  const collectionName = getCollectionNameByUrl(entity.id);
  const _id = entity.id.toString();
  const convertedEntity = cleanProps(
    convertUrlsToStrings(applyContext(entity)),
  );

  await this.db.collection(collectionName).replaceOne(
    {
      _id,
    },
    convertedEntity,
    {
      upsert: true,
    },
  );
}
