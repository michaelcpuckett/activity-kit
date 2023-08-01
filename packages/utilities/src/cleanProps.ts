import * as AP from '@activity-kit/types';

/**
 * Removes the private `bto` and `bcc` properties from Entities so they don't
 * leak out upon delivery.
 *
 * From the ActivityPub spec:
 *
 * > `bto` and `bcc` already must be removed for delivery, but servers are free
 * > to decide how to represent the object in their own storage systems.
 * > However, since bto and bcc are only intended to be known/seen by the
 * > original author of the object/activity, servers should omit these
 * > properties during display as well.
 *
 * @returns The Entity with the private properties removed.
 *
 * @see https://www.w3.org/TR/activitypub/#security-not-displaying-bto-bcc
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
