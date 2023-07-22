import { MongoDbAdapter } from '.';
import * as AP from '@activity-kit/types';
import { Db } from 'mongodb';
import {
  convertEntityToJson,
  getCollectionNameByUrl,
} from '@activity-kit/utilities';

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

  await this.db.collection(collectionName).replaceOne(
    {
      _id,
    },
    convertEntityToJson(entity),
    {
      upsert: true,
    },
  );
}
