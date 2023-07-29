import * as AP from '@activity-kit/types';
import { getCollectionNameByUrl } from '@activity-kit/utilities';

import { CoreLibrary } from './adapters';

export async function findEntityById(
  this: CoreLibrary,
  id: URL,
): Promise<AP.Entity | null> {
  const collectionName = getCollectionNameByUrl(id);

  return await this.findOne(collectionName, { id: id.href });
}
