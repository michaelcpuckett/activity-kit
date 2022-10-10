import { AP } from '../types';

export const getTypedEntity = (entity: { type: string }) => {
  for (const linkType of Object.values(AP.LinkTypes)) {
    if (entity.type === linkType) {
      return entity as AP.Link;
    }
  }

  for (const activityType of Object.values(AP.ActivityTypes)) {
    if (entity.type === activityType) {
      return entity as AP.Activity;
    }
  }

  for (const actorType of Object.values(AP.ActorTypes)) {
    if (entity.type === actorType) {
      return entity as AP.Actor;
    }
  }

  if (entity.type === AP.CollectionTypes.COLLECTION) {
    return entity as AP.Collection;
  }

  if (entity.type === AP.CollectionTypes.ORDERED_COLLECTION) {
    return entity as AP.OrderedCollection;
  }

  if (entity.type === AP.CollectionPageTypes.COLLECTION_PAGE) {
    return entity as AP.CollectionPage;
  }

  if (entity.type === AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE) {
    return entity as AP.OrderedCollectionPage;
  }

  for (const objectType of Object.values(AP.ExtendedObjectTypes)) {
    if (entity.type === objectType) {
      return entity as AP.ExtendedObject;
    }
  }

  return null;
};
