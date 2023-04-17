import { isLocal, isType } from '@activity-kit/utilities';
import { Core } from '.';
import { AP } from '@activity-kit/types';

export async function queryById(
  this: Core,
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

  return fetchedEntity;
}
