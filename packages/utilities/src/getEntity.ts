import { AP } from '@activity-kit/types';

export const getEntity = (
  entity: undefined | null | AP.EntityReference | AP.EntityReference[],
): AP.Entity | null => {
  if (!entity) {
    return null;
  }

  if (entity instanceof URL) {
    return null;
  }

  if (Array.isArray(entity)) {
    if (entity.length === 1) {
      if (entity[0] instanceof URL) {
        return null;
      }

      return entity[0];
    }

    return null;
  }

  return entity;
};
