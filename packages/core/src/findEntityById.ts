import * as AP from '@activity-kit/types';
import { getCollectionNameByUrl } from '@activity-kit/utilities';

import { CoreLibrary } from '.';

/**
 * Finds an Entity by its ID, which is a URL.
 *
 * @returns The Entity, or null if not found.
 */
export async function findEntityById(
  this: CoreLibrary,
  id: URL,
): Promise<AP.Entity | null> {
  const collectionName = getCollectionNameByUrl(id);

  return await this.findOne(collectionName, { id: id.href });
}
