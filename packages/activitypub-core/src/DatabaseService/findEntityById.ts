import { DatabaseService } from '.';
import { AP } from '../types';
import { getCollectionNameByUrl } from '../utilities/getCollectionNameByUrl';

export async function findEntityById(
  this: DatabaseService,
  id: URL,
): Promise<AP.Entity | null> {
  const collectionName = getCollectionNameByUrl(id);

  if (collectionName === 'foreign-object') {
    return null;
  }

  return await this.findOne(collectionName, { _id: id.toString() });
}
