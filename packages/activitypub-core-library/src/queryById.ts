import { isLocal } from 'activitypub-core-utilities';
import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: CoreLibrary,
  id: URL,
): Promise<AP.Entity | null> {
  if (isLocal(id)) {
    return await this.findEntityById(id);
  }

  return await this.fetchEntityById(id);
}
