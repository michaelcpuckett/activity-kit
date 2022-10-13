import { CollectionTypes, CollectionPageTypes } from '../util/const';
import { BaseCoreObject } from '../Core/CoreObject';
import { EntityReference } from '../Core';
import { Link } from '../Core/Link';

type BaseCollection = BaseCoreObject & {
  type:
  | typeof CollectionTypes[keyof typeof CollectionTypes]
  | typeof CollectionPageTypes[keyof typeof CollectionPageTypes];
  totalItems?: number;
  items?: EntityReference | EntityReference[];
  current?: URL | CollectionPage | Link;
  first?: URL | CollectionPage | Link;
  last?: URL | CollectionPage | Link;
};

export type Collection = BaseCollection & {
  type: typeof CollectionTypes.COLLECTION;
};

export type OrderedCollection = BaseCollection & {
  type: typeof CollectionTypes.ORDERED_COLLECTION;
  orderedItems?: EntityReference | EntityReference[];
};

type BaseCollectionPage = BaseCollection & {
  type: typeof CollectionPageTypes[keyof typeof CollectionPageTypes];
  current?: URL | CollectionPage | Link;
  first?: URL | CollectionPage | Link;
  last?: URL | CollectionPage | Link;
};

export type CollectionPage = BaseCollectionPage & {
  type: typeof CollectionPageTypes.COLLECTION_PAGE;
};

export type OrderedCollectionPage = BaseCollectionPage & {
  type: typeof CollectionPageTypes.ORDERED_COLLECTION_PAGE;
  startIndex?: number;
  orderedItems?: EntityReference | EntityReference[];
};

export type CollectionReference = URL | Collection;
export type OrderedCollectionReference = URL | OrderedCollection;

export type CollectionPageReference = URL | CollectionPage;
export type OrderedCollectionPageReference = URL | OrderedCollectionPage;

export type EitherCollection = Collection | OrderedCollection;
export type EitherCollectionPage = CollectionPage | OrderedCollectionPage;

export type EitherCollectionReference = URL | EitherCollection;
export type EitherCollectionPageReference = URL | EitherCollectionPage;
