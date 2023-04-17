import { AP, isType, isTypeOf } from '@activity-kit/types';

export const getTypedEntity = (entity: AP.Entity): AP.Entity | null => {
  if (isTypeOf<AP.Link>(entity, AP.LinkTypes)) {
    return entity;
  }

  if (isTypeOf<AP.Activity>(entity, AP.ActivityTypes)) {
    return entity;
  }

  if (isTypeOf<AP.Actor>(entity, AP.ActorTypes)) {
    return entity;
  }

  if (isType<AP.Collection>(entity, AP.CollectionTypes.COLLECTION)) {
    return entity;
  }

  if (
    isType<AP.OrderedCollection>(entity, AP.CollectionTypes.ORDERED_COLLECTION)
  ) {
    return entity;
  }

  if (
    isType<AP.CollectionPage>(entity, AP.CollectionPageTypes.COLLECTION_PAGE)
  ) {
    return entity;
  }

  if (
    isType<AP.OrderedCollectionPage>(
      entity,
      AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
    )
  ) {
    return entity;
  }

  if (isTypeOf<AP.ExtendedObject>(entity, AP.ExtendedObjectTypes)) {
    return entity;
  }

  return null;
};
