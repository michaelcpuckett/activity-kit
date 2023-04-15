import { isLocal, isType } from 'activitypub-core-utilities';
import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: CoreLibrary,
  id: URL,
): Promise<AP.Entity | null> {
  if (isLocal(id)) {
    return await this.findEntityById(id);
  }

  const fetchedEntity = await this.fetchEntityById(id);

  if (
    !fetchedEntity ||
    isType(fetchedEntity, AP.ExtendedObjectTypes.TOMBSTONE)
  ) {
    return this.findEntityById(id);
  }

  return null;
}
