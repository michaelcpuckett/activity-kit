import * as AP from '@activity-kit/types';

export const getEntity = <T extends AP.Entity>(
  entity: undefined | null | AP.EntityReference | AP.EntityReference[],
): T | null => {
  if (!entity) {
    return null;
  }

  if (entity instanceof URL) {
    return null;
  }

  if (Array.isArray(entity)) {
    if (entity.length === 1) {
      if (!entity[0] || entity[0] instanceof URL) {
        return null;
      }

      return entity[0] as T;
    }

    return null;
  }

  return entity as T;
};
