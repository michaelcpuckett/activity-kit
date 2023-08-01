import { Link, Mention } from './Link';
import { Actor } from '../Extended/Actor';
import { Activity } from '../Extended/Activity';
import { AnyCollectionOrCollectionPage } from '../Extended/Collection';
import { ExtendedObject } from '../Extended';
export { CoreObjectProperties } from './CoreObject';
export type { Link, LinkReference, Mention } from './Link';

/**
 * The base type for all ActivityPub Objects (including Extended Objects).
 *
 * @note This type is named `CoreObject` instead of `Object` because of the
 * following concerns:
 * - All ActivityPub Objects are objects, but not all objects are
 *   ActivityPub Objects. In particular, Links are not ActivityPub Objects.
 * - There are a set of Extended Objects that inherit from this type.
 * - `Object` is a reserved keyword in JavaScript.
 *
 * @see https://www.w3.org/TR/activitystreams-core/#object
 *
 * @extends BaseEntity
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
 * The base type for all ActivityPub Entities, including Object and Link types.
 *
 * @note The spec does not specify a base type, but this library does for
 * convenience and easier type checking.
 *
 * @note The spec allows the type to be optional, but it is required by this
 * library in order to differentiate between different types of Entities.
 *
 * @instance CoreObject
 * @instance Link
 */
export type Entity = CoreObject | Link | Mention;

/**
 * Either an Entity or a URL reference to an Entity.
 */
export type EntityReference = URL | Entity;
