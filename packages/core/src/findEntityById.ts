import { Core } from '.';
import { AP } from '@activity-kit/types';
import { getCollectionNameByUrl } from '@activity-kit/utilities';

export async function findEntityById(
  this: Core,
  id: URL,
): Promise<AP.Entity | null> {
  const collectionName = getCollectionNameByUrl(id);

  return await this.findOne(collectionName, { id: id.toString() });
}
