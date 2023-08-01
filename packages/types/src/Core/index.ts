import { Link, Mention } from './Link';
import { Actor } from '../Extended/Actor';
import { Activity } from '../Extended/Activity';
import { Collection, OrderedCollection } from '../Extended/Collection';
import { CollectionPage, OrderedCollectionPage } from '../Extended/Collection';
import { ExtendedObject } from '../Extended';
export { CoreObjectProperties } from './CoreObject';
export type { Link, LinkReference, Mention } from './Link';

/**
 * Per the spec:
 *
 * > The Object is the primary base type for the Activity Streams vocabulary.
 *
 * > In addition to having a global identifier (expressed as an absolute IRI
 * > using the id property) and an "object type" (expressed using the type
 * > property), all instances of the Object type share a common set of
 * > properties normatively defined by the Activity Vocabulary.
 *
 * > All properties are optional (including the id ~and the type~).
 *
 * @note The spec allows the type to be optional, but it is required by this
 * library.
 *
 * @see https://www.w3.org/TR/activitystreams-core/#object
 *
 * @note All ActivityPub Objects are objects, but not all objects are
 * ActivityPub Objects. For example, a Link is an object, but not an
 * ActivityPub Object. For this reason, it is referred to as a "Core Object".
 *
 * @extends BaseEntity
 * @extends CoreObjectProperties
 *
 * @instance ExtendedObject
 * @instance Actor
 * @instance Activity
 * @instance Collection
 * @instance OrderedCollection
 * @instance CollectionPage
 * @instance OrderedCollectionPage
 *
 */
export type CoreObject =
  | ExtendedObject
  | Actor
  | Activity
  | Collection
  | OrderedCollection
  | CollectionPage
  | OrderedCollectionPage;

/**
 * Either a CoreObject or a URL reference to a CoreObject.
 */
export type CoreObjectReference = URL | CoreObject;

/**
 * The base type for all ActivityPub entities.
 *
 * The ActivityPub spec does not specify a base type, but this library does
 * for convenience.
 *
 * @note The spec allows the type to be optional, but it is required by this
 * library.
 *
 * @extends BaseEntity
 *
 * @instance CoreObject
 * @instance Link
 */
export type Entity = CoreObject | Link | Mention;

/**
 * Either an Entity or a URL reference to an Entity.
 */
export type EntityReference = URL | Entity;
