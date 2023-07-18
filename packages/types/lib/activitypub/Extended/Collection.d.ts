/// <reference types="node" />
import { CollectionTypes, CollectionPageTypes, OrArray, AnyType } from '../util';
import { CoreObjectProperties } from '../Core/CoreObject';
import { EntityReference } from '../Core';
import { Link } from '../Core/Link';
import { BaseEntity } from '../Core/Entity';
export type AnyCollectionType = (typeof CollectionTypes)[keyof typeof CollectionTypes];
export type AnyCollectionPageType = (typeof CollectionPageTypes)[keyof typeof CollectionPageTypes];
export type AnyCollectionOrCollectionPageType = AnyCollectionType | AnyCollectionPageType;
type CollectionProperties = {
    totalItems?: number;
    items?: OrArray<BaseEntity<AnyType>>;
    orderedItems?: OrArray<BaseEntity<AnyType>>;
    current?: URL | CollectionPage | Link;
    first?: URL | CollectionPage | Link;
    last?: URL | CollectionPage | Link;
};
export type BaseCollection<T extends AnyCollectionOrCollectionPageType> = BaseEntity<T> & CoreObjectProperties & CollectionProperties;
export type Collection = BaseCollection<typeof CollectionTypes.COLLECTION>;
export type OrderedCollection = BaseCollection<typeof CollectionTypes.ORDERED_COLLECTION>;
type CollectionPageProperties = {
    partOf?: URL | EitherCollection | Link;
    next?: URL | CollectionPage | Link;
    prev?: URL | CollectionPage | Link;
};
type BaseCollectionPage<T extends AnyCollectionPageType> = BaseCollection<T> & CollectionPageProperties;
export type CollectionPage = BaseCollectionPage<typeof CollectionPageTypes.COLLECTION_PAGE>;
type OrderedCollectionPageProperties = {
    startIndex?: number;
    orderedItems?: OrArray<EntityReference>;
};
export type OrderedCollectionPage = BaseCollectionPage<typeof CollectionPageTypes.ORDERED_COLLECTION_PAGE> & OrderedCollectionPageProperties;
export type CollectionReference = URL | Collection;
export type OrderedCollectionReference = URL | OrderedCollection;
export type CollectionPageReference = URL | CollectionPage;
export type OrderedCollectionPageReference = URL | OrderedCollectionPage;
export type EitherCollection = Collection | OrderedCollection;
export type EitherCollectionPage = CollectionPage | OrderedCollectionPage;
export type EitherCollectionReference = URL | EitherCollection;
export type EitherCollectionPageReference = URL | EitherCollectionPage;
export {};
