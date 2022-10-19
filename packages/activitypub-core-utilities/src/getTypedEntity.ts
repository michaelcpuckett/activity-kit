import { AP } from 'activitypub-core-types';

export const getTypedEntity = (entity: { [key: string]: unknown }): AP.Link|AP.Activity|AP.Actor|AP.Collection|AP.OrderedCollection|AP.CollectionPage|AP.OrderedCollectionPage|AP.ExtendedObject|null => {
  for (const linkType of Object.values(AP.LinkTypes)) {
    if (entity.type === linkType || (
      Array.isArray(entity.type) && entity.type.includes(linkType)
    )) {
      return entity as unknown as AP.Link;
    }
  }

  for (const activityType of Object.values(AP.ActivityTypes)) {
    if (entity.type === activityType || (
      Array.isArray(entity.type) && entity.type.includes(activityType)
    )) {
      return entity as unknown as AP.Activity;
    }
  }

  for (const actorType of Object.values(AP.ActorTypes)) {
    if (entity.type === actorType || (
      Array.isArray(entity.type) && entity.type.includes(actorType)
    )) {
      return entity as unknown as AP.Actor;
    }
  }

  if (entity.type === AP.CollectionTypes.COLLECTION || (
    Array.isArray(entity.type) && entity.type.includes(AP.CollectionTypes.COLLECTION)
  )) {
    return entity as unknown as AP.Collection;
  }

  if (entity.type === AP.CollectionTypes.ORDERED_COLLECTION || (
    Array.isArray(entity.type) && entity.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
  )) {
    return entity as unknown as AP.OrderedCollection;
  }

  if (entity.type === AP.CollectionPageTypes.COLLECTION_PAGE || (
    Array.isArray(entity.type) && entity.type.includes(AP.CollectionPageTypes.COLLECTION_PAGE)
  )) {
    return entity as unknown as AP.CollectionPage;
  }

  if (entity.type === AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE || (
    Array.isArray(entity.type) && entity.type.includes(AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE)
  )) {
    return entity as unknown as AP.OrderedCollectionPage;
  }

  for (const extendedObjectType of Object.values(AP.ExtendedObjectTypes)) {
    if (entity.type === extendedObjectType || (
      Array.isArray(entity.type) && entity.type.includes(extendedObjectType)
    )) {
      return entity as unknown as AP.ExtendedObject;
    }
  }

  return null;
};
