import { BaseEntity } from './Entity';
import { LinkTypes, OrArray, StringReferenceMap } from '../util';
import { EntityReference } from '.';

/**
 * A union of all Link types.
 */
export type AnyLinkType = (typeof LinkTypes)[keyof typeof LinkTypes];

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > A Link is an indirect, qualified reference to a resource identified by a
 * > URL. The fundamental model for links is established by [RFC5988]. Many of
 * > the properties defined by the Activity Vocabulary allow values that are
 * > either instances of Object or Link. When a Link is used, it establishes a
 * > qualified relation connecting the subject (the containing object) to the
 * > resource identified by the href. Properties of the Link are properties of
 * > the reference as opposed to properties of the resource.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-link
 *
 * @extends BaseEntity
 *
 * @instance Link
 * @instance Mention
 *
 */

/**
 * Properties common to all Link types.
 */
export type LinkProperties = {
  height?: number;
  href?: URL;
  hrefLang?: string;
  mediaType?: string;
  name?: string;
  nameMap?: StringReferenceMap;
  preview?: OrArray<EntityReference>;
  rel?: OrArray<string>;
  width?: number;
};

/**
 * The base type for all Link entities.
 *
 * @extends BaseEntity
 * @extends LinkProperties
 *
 * @instance Link
 * @instance Mention
 */
export type BaseLink<T extends AnyLinkType> = BaseEntity<T> & LinkProperties;

/**
 * A Link entity.
 *
 * @note This differs from BaseLink, from which it extends. BaseLink is the
 * base type for all Link entities. This is the type for the Link entity
 * specifically.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-link
 */
export type LinkEntity = BaseLink<typeof LinkTypes.LINK>;

/**
 * A Mention entity.
 */
export type Mention = BaseLink<typeof LinkTypes.MENTION>;

/**
 * A Link entity or Mention entity.
 */
export type Link = LinkEntity | Mention;

/**
 * Either a Link or a URL reference to a Link.
 */
export type LinkReference = URL | Link;
