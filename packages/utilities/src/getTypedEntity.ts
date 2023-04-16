import { AP } from '@activity-kit/types';
import { isTypeOf, isType } from './isType';

export const getTypedEntity = (entity: AP.Entity) => {
  if (isTypeOf(entity, AP.LinkTypes)) {
    return entity as AP.Link;
  }

  if (isTypeOf(entity, AP.ActivityTypes)) {
    return entity as AP.Activity;
  }

  if (isTypeOf(entity, AP.ActorTypes)) {
    return entity as AP.Actor;
  }

  if (isType(entity, AP.CollectionTypes.COLLECTION)) {
    return entity as AP.Collection;
  }

  if (isType(entity, AP.CollectionTypes.ORDERED_COLLECTION)) {
    return entity as AP.OrderedCollection;
  }

  if (isType(entity, AP.CollectionPageTypes.COLLECTION_PAGE)) {
    return entity as AP.CollectionPage;
  }

  if (isType(entity, AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE)) {
    return entity as AP.OrderedCollectionPage;
  }

  if (isTypeOf(entity, AP.ExtendedObjectTypes)) {
    return entity as AP.ExtendedObject;
  }

  console.log(entity);
  console.log('^-- entity is null?');

  return null;
};
