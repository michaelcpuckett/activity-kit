import { AP } from 'activitypub-core-types/src';

export const getId = (
  entity?: undefined | null | AP.EntityReference | AP.EntityReference[],
): URL | null => {
  if (!entity || Array.isArray(entity)) {
    return null;
  }

  if (entity instanceof URL) {
    return entity;
  }

  if (typeof entity === 'string') {
    try {
      return new URL(entity);
    } catch (error) {
      return null;
    }
  }

  if (typeof entity === 'object' && 'id' in entity && entity.id) {
    if (entity.id instanceof URL) {
      return entity.id;
    }

    try {
      return new URL(entity.id);
    } catch (error) {
      return null;
    }
  }

  return null;
};
