import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { isLocal } from '@activity-kit/utilities';

import { CoreLibrary } from './adapters';

export const queryById: CoreLibrary['queryById'] = async function queryById(
  this: CoreLibrary,
  id: URL,
): Promise<AP.Entity | null> {
  if (isLocal(id)) {
    return await this.findEntityById(id);
  }

  const fetchedEntity = await this.fetchEntityById(id);

  if (
    !fetchedEntity ||
    guard.isApType<AP.Tombstone>(
      fetchedEntity,
      AP.ExtendedObjectTypes.TOMBSTONE,
    )
  ) {
    const foundEntity = await this.findEntityById(id);

    if (foundEntity) {
      return foundEntity;
    }
  }

  return fetchedEntity;
};
