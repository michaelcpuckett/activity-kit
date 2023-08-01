import { CollectionTypes, CollectionPageTypes, OrArray } from '../util';
import { CoreObjectProperties } from '../Core/CoreObject';
import { EntityReference } from '../Core';
import { Link } from '../Core/Link';
import { BaseEntity } from '../Core/Entity';

/** A union of all Collection types. */
export type AnyCollectionType =
  (typeof CollectionTypes)[keyof typeof CollectionTypes];

/** A union of all CollectionPage types. */
export type AnyCollectionPageType =
  (typeof CollectionPageTypes)[keyof typeof CollectionPageTypes];

/**
 * A union of all Collection and CollectionPage types.
 */
export type AnyCollectionOrCollectionPageType =
  | AnyCollectionType
  | AnyCollectionPageType;

/**
 * Properties common to all Collection types.
 */
type CollectionProperties = {
  totalItems?: number;
  items?: OrArray<EntityReference>;
  startIndex?: number;
  orderedItems?: OrArray<EntityReference>;
  current?: URL | CollectionPage | Link;
  first?: URL | CollectionPage | Link;
  last?: URL | CollectionPage | Link;
};

/**
 * The base type for all Collection and CollectionPage entities.
 *
 * Per the ActivityPub spec:
 *
 * > A Collection is a subtype of Object that represents ordered or unordered
 * > sets of Object or Link instances.
 *
 * Per the Activity Streams 2.0 Core spec:
 *
 * > Collection objects are a specialization of the base Object that serve as a
 * > container for other Objects or Links.
 *
 * @extends BaseEntity
 * @extends CoreObjectProperties
 * @extends CollectionProperties
 *
 * @instance Collection
 * @instance OrderedCollection
 * @instance CollectionPage
 * @instance OrderedCollectionPage
 *
 * @see https://www.w3.org/TR/activitypub/#collection
 */
export type BaseCollection<T extends AnyCollectionOrCollectionPageType> =
  BaseEntity<T> & CoreObjectProperties & CollectionProperties;

/**
 * This type indicates a Collection object with a type of `Collection`.
 *
 * @note Although use of "orderedItems" with "Collection" is not prohibited by
 * the spec, it is not recommended. Use "OrderedCollection" instead.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-collection
 *
 * @extends BaseCollection
 */
export type Collection = BaseCollection<typeof CollectionTypes.COLLECTION>;

/**
 * This type indicates a Collection object with a type of `OrderedCollection`.
 *
 * @note Although use of "items" with "OrderedCollection" is not prohibited by
 * the spec, it is not recommended. Use "Collection" instead.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-orderedcollection
 *
 * @extends BaseCollection
 */
export type OrderedCollection = BaseCollection<
  typeof CollectionTypes.ORDERED_COLLECTION
>;

/**
 * Properties common to all CollectionPage types.
 */
type CollectionPageProperties = {
  partOf?: URL | EitherCollection | Link;
  next?: URL | CollectionPage | Link;
  prev?: URL | CollectionPage | Link;
};

/**
 * The base type for all CollectionPage entities.
 *
 * @extends BaseCollection
 * @extends CollectionPageProperties
 *
 * @instance CollectionPage
 * @instance OrderedCollectionPage
 */
type BaseCollectionPage<T extends AnyCollectionPageType> = BaseCollection<T> &
  CollectionPageProperties;

/**
 * This type indicates a CollectionPage object with a type of `CollectionPage`.
 *
 * Per the ActivityStreams 2.0 Core spec:
 *
 * > A CollectionPage is a subtype of Collection that represents a subset of
 * > items from another Collection. CollectionPage instances are typically
 * > used to represent the items on a single page of a multi-page
 * > Collection. They typically have a shorter lifespan than the Collection
 * > instances that contain them. While a Collection indicates the entire
 * > set of items a CollectionPage MAY be used to represent a subset of
 * > those items. For example, an Activity MAY be associated with a
 * > Collection of likes. The Collection might represent all of the likes
 * > that the activity has received. A CollectionPage with a `partOf`
 * > property of the Activity MAY be used to represent a subset of those
 * > likes from a single page.
 *
 * > A CollectionPage that has a `prev` property with a CollectionPage
 * > value describes a time ordered subset of items from a Collection. The
 * > items in the subset are ordered by their `published` property such
 * > that earliest items have the lowest `published` timestamps.
 *
 * @extends BaseCollectionPage
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-collectionpage
 * @see https://www.w3.org/TR/activitystreams-core/#collectionpage
 * @see https://www.w3.org/TR/activitypub/#collectionpage
 */
export type CollectionPage = BaseCollectionPage<
  typeof CollectionPageTypes.COLLECTION_PAGE
>;

/**
 * This type indicates a CollectionPage object with a type of
 * `OrderedCollectionPage`.
 *
 * Per the ActivityPub spec:
 *
 * > Used to represent ordered subsets of items from an OrderedCollection.
 *
 * This is typically used to represent pages of items in a collection that
 * maintain a specific order.
 *
 * @extends BaseCollectionPage
 *
 * @see CollectionPage
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-orderedcollectionpage
 * @see https://www.w3.org/TR/activitystreams-core/#orderedcollectionpage
 * @see https://www.w3.org/TR/activitypub/#orderedcollectionpage
 */
export type OrderedCollectionPage = BaseCollectionPage<
  typeof CollectionPageTypes.ORDERED_COLLECTION_PAGE
>;

/**
 * A reference to a Collection object or a URL reference to a Collection object.
 */
export type CollectionReference = URL | Collection;

/**
 * A reference to an OrderedCollection object or a URL reference to an
 * OrderedCollection object.
 */
export type OrderedCollectionReference = URL | OrderedCollection;

/**
 * A reference to a CollectionPage object or a URL reference to a CollectionPage
 * object.
 */
export type CollectionPageReference = URL | CollectionPage;

/**
 * A reference to an OrderedCollectionPage object or a URL reference to an
 * OrderedCollectionPage object.
 */
export type OrderedCollectionPageReference = URL | OrderedCollectionPage;

/**
 * Either a Collection or OrderedCollection object.
 */
export type EitherCollection = Collection | OrderedCollection;

/**
 * Either a CollectionPage or OrderedCollectionPage object or a URL reference to
 * a CollectionPage or OrderedCollectionPage object.
 */
export type EitherCollectionPage = CollectionPage | OrderedCollectionPage;

/**
 * A reference to a Collection or OrderedCollection object or a URL reference to
 * a Collection or OrderedCollection object.
 */
export type EitherCollectionReference = URL | EitherCollection;

/**
 * A reference to a CollectionPage or OrderedCollectionPage object or a URL
 * reference to a CollectionPage or OrderedCollectionPage object.
 */
export type EitherCollectionPageReference = URL | EitherCollectionPage;
