import * as AP from '@activity-kit/types';

/**
 * Removes the private `bto` and `bcc` properties from Entities so they don't
 * leak out upon delivery.
 **/
export function cleanProps(entity: AP.Entity): AP.Entity {
  const cleanedEntity = { ...entity };

  if ('bto' in cleanedEntity) {
    delete cleanedEntity.bto;
  }

  if ('bcc' in cleanedEntity) {
    delete cleanedEntity.bcc;
  }

  return cleanedEntity;
}
