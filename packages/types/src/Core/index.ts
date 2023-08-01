import { Link, Mention } from './Link';
import { Actor } from '../Extended/Actor';
import { Activity } from '../Extended/Activity';
import { AnyCollectionOrCollectionPage } from '../Extended/Collection';
import { ExtendedObject } from '../Extended';
export { CoreObjectProperties } from './CoreObject';
export type { Link, LinkReference, Mention } from './Link';

/**
 * The base type for all ActivityPub Object Types, including Actors, Activities,
 * Collections, and Extended Objects.
 *
 * @note This type is named `CoreObject` instead of `Object` to avoid collision
 * with the JavaScript `Object` type. Further, this avoids confusion with what
 * the spec refers to as "Objects", which are called "Entities" in this library.
 *
 * @see https://www.w3.org/TR/activitystreams-core/#object
 *
 * @extends Entity
 *
 * @instance ExtendedObject
 * @instance Actor
 * @instance Activity
 * @instance Collection
 */
export type CoreObject =
  | ExtendedObject
  | Actor
  | Activity
  | AnyCollectionOrCollectionPage;

/**
 * Either a CoreObject or a URL reference to a CoreObject.
 */
export type CoreObjectReference = URL | CoreObject;

/**
 * The base type for all ActivityPub objects, including Core Object and Link
 * types.
 *
 * @note The spec does not specify a base type, but this library does for
 * convenience and easier type checking. Instead, the spec refers to all
 * ActivityPub documents as "Objects". This library uses the term "Entity" to
 * refer to all ActivityPub documents, including both Core Objects and Links.
 *
 * @note The spec allows the type property to be optional, but it is required by
 * this library in order to differentiate between different types of objects.
 *
 * @instance CoreObject
 * @instance Link
 */
export type Entity = CoreObject | Link | Mention;

/**
 * Either an Entity or a URL reference to an Entity.
 */
export type EntityReference = URL | Entity;
