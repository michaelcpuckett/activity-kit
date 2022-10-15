/// <reference types="node" />
import { CollectionTypes, CollectionPageTypes } from '../util/const';
import { BaseCoreObject } from '../Core/CoreObject';
import { EntityReference } from '../Core';
import { Link } from '../Core/Link';
declare type BaseCollection = BaseCoreObject & {
  type:
    | typeof CollectionTypes[keyof typeof CollectionTypes]
    | typeof CollectionPageTypes[keyof typeof CollectionPageTypes];
  totalItems?: number;
  items?: EntityReference | EntityReference[];
  current?: URL | CollectionPage | Link;
  first?: URL | CollectionPage | Link;
  last?: URL | CollectionPage | Link;
};
export declare type Collection = BaseCollection & {
  type: typeof CollectionTypes.COLLECTION;
};
export declare type OrderedCollection = BaseCollection & {
  type: typeof CollectionTypes.ORDERED_COLLECTION;
  orderedItems?: EntityReference | EntityReference[];
};
declare type BaseCollectionPage = BaseCollection & {
  type: typeof CollectionPageTypes[keyof typeof CollectionPageTypes];
  current?: URL | CollectionPage | Link;
  first?: URL | CollectionPage | Link;
  last?: URL | CollectionPage | Link;
};
export declare type CollectionPage = BaseCollectionPage & {
  type: typeof CollectionPageTypes.COLLECTION_PAGE;
};
export declare type OrderedCollectionPage = BaseCollectionPage & {
  type: typeof CollectionPageTypes.ORDERED_COLLECTION_PAGE;
  startIndex?: number;
  orderedItems?: EntityReference | EntityReference[];
};
export declare type CollectionReference = URL | Collection;
export declare type OrderedCollectionReference = URL | OrderedCollection;
export declare type CollectionPageReference = URL | CollectionPage;
export declare type OrderedCollectionPageReference =
  | URL
  | OrderedCollectionPage;
export declare type EitherCollection = Collection | OrderedCollection;
export declare type EitherCollectionPage =
  | CollectionPage
  | OrderedCollectionPage;
export declare type EitherCollectionReference = URL | EitherCollection;
export declare type EitherCollectionPageReference = URL | EitherCollectionPage;
export {};
