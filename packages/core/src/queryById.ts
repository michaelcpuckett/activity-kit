import { Core } from '.';
import * as AP from '@activity-kit/types';
import { isType } from '@activity-kit/type-utilities';
import { isLocal } from '@activity-kit/utilities';

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
    isType<AP.Tombstone>(fetchedEntity, AP.ExtendedObjectTypes.TOMBSTONE)
  ) {
    return this.findEntityById(id);
  }

  return fetchedEntity;
}
