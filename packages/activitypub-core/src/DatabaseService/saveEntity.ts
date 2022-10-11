import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types/src';
import { cleanProps } from '../utilities/cleanProps';
import { compressEntity } from '../utilities/compressEntity';
import { convertUrlsToStrings } from '../utilities/convertUrlsToStrings';
import { getCollectionNameByUrl } from '../utilities/getCollectionNameByUrl';

export async function saveEntity(this: DatabaseService, entity: AP.Entity) {
  if (!entity.id) {
    throw new Error('No ID.');
  }

  const collectionName = getCollectionNameByUrl(entity.id);
  const _id = entity.id.toString();
  const convertedEntity = convertUrlsToStrings(cleanProps(compressEntity(entity)));

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
