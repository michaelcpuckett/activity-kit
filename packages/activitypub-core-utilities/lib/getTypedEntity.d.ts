import { AP } from 'activitypub-core-types';
export declare const getTypedEntity: (entity: {
  [key: string]: unknown;
}) =>
  | AP.Link
  | AP.Activity
  | AP.Actor
  | AP.Collection
  | AP.OrderedCollection
  | AP.CollectionPage
  | AP.OrderedCollectionPage
  | AP.ExtendedObject
  | null;
