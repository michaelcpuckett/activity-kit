import * as AP from '@activity-kit/types';
import { cast, guard } from '@activity-kit/type-utilities';

export const getEntity = <T extends AP.Entity>(
  entity: undefined | null | AP.EntityReference | AP.EntityReference[],
): T | null => {
  if (!guard.exists(entity)) {
    return null;
  }

  if (guard.isUrl(entity)) {
    return null;
  }

  if (guard.isArray(entity)) {
    if (entity.length === 1) {
      const [item] = entity;

      return cast.isApTypeOf<T & AP.Entity>(item, AP.AllTypes) ?? null;
    }

    return null;
  }

  return cast.isApTypeOf<T & AP.Entity>(entity, AP.AllTypes) ?? null;
};
