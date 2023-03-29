import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import { getCollectionNameByUrl } from 'activitypub-core-utilities';

export async function findEntityById(
  this: D1DbAdapter,
  id: URL,
): Promise<AP.Entity | null> {
  const collectionName = getCollectionNameByUrl(id);

  return await this.findOne(collectionName, { id: id.toString() });
}
