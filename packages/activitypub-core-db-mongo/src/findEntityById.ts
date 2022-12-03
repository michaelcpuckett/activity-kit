import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import { getCollectionNameByUrl } from 'activitypub-core-utilities';

export async function findEntityById(
  this: MongoDbAdapter,
  id: URL,
): Promise<AP.Entity | null> {
  const collectionName = getCollectionNameByUrl(id);

  return await this.findOne(collectionName, { _id: id.toString() });
}
