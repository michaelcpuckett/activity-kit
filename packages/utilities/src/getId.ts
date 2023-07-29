import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';

export const getId = (
  entity?: undefined | null | AP.EntityReference | AP.EntityReference[],
): URL | null => {
  if (!guard.exists(entity)) {
    return null;
  }

  if (guard.isUrl(entity)) {
    return entity;
  }

  if (guard.isPlainObject(entity)) {
    if ('id' in entity && guard.isUrl(entity.id)) {
      return entity.id;
    }

    if ('url' in entity && guard.isUrl(entity.url)) {
      return entity.url;
    }

    if ('href' in entity && guard.isUrl(entity.href)) {
      return entity.href;
    }
  }

  return null;
};
