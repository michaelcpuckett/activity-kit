import { CollectionTypes, CollectionPageTypes } from '../util/const';
import { BaseCoreObject } from '../Core/CoreObject';
import { EntityReference } from '../Core';
import { Link } from '../Core/Link';
import { TypeOrArrayWithType } from '../Core/Entity';
declare type BaseCollection = BaseCoreObject & {
    type: TypeOrArrayWithType<typeof CollectionTypes[keyof typeof CollectionTypes] | typeof CollectionPageTypes[keyof typeof CollectionPageTypes]>;
    totalItems?: number;
    items?: EntityReference | EntityReference[];
    orderedItems?: EntityReference | EntityReference[];
    current?: URL | CollectionPage | Link;
    first?: URL | CollectionPage | Link;
    last?: URL | CollectionPage | Link;
};
export declare type Collection = BaseCollection & {
    type: TypeOrArrayWithType<typeof CollectionTypes.COLLECTION>;
};
export declare type OrderedCollection = BaseCollection & {
    type: TypeOrArrayWithType<typeof CollectionTypes.ORDERED_COLLECTION>;
};
declare type BaseCollectionPage = BaseCollection & {
    type: TypeOrArrayWithType<typeof CollectionPageTypes[keyof typeof CollectionPageTypes]>;
    partOf?: URL | EitherCollection | Link;
    next?: URL | CollectionPage | Link;
    prev?: URL | CollectionPage | Link;
};
export declare type CollectionPage = BaseCollectionPage & {
    type: TypeOrArrayWithType<typeof CollectionPageTypes.COLLECTION_PAGE>;
};
export declare type OrderedCollectionPage = BaseCollectionPage & {
    type: TypeOrArrayWithType<typeof CollectionPageTypes.ORDERED_COLLECTION_PAGE>;
    startIndex?: number;
    orderedItems?: EntityReference | EntityReference[];
};
export declare type CollectionReference = URL | Collection;
export declare type OrderedCollectionReference = URL | OrderedCollection;
export declare type CollectionPageReference = URL | CollectionPage;
export declare type OrderedCollectionPageReference = URL | OrderedCollectionPage;
export declare type EitherCollection = Collection | OrderedCollection;
export declare type EitherCollectionPage = CollectionPage | OrderedCollectionPage;
export declare type EitherCollectionReference = URL | EitherCollection;
export declare type EitherCollectionPageReference = URL | EitherCollectionPage;
export {};
