/// <reference types="node" />
import { BaseEntity } from './Entity';
import { LinkTypes, OrArray, StringReferenceMap } from '../util';
import { EntityReference } from '.';
/**
 * A union of all Link types.
 */
export type AnyLinkType = (typeof LinkTypes)[keyof typeof LinkTypes];
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
 * The base type for all Link types.
 *
 * @note This differs from Link, which is the type for a Link entity
 * specifically. This is the base type for all Link types, including the Link
 * and Mention types.
 *
 * @extends BaseEntity
 *
 * @instance Link
 * @instance Mention
 */
export type BaseLink<T extends AnyLinkType> = BaseEntity<T> & LinkProperties;
/**
 * A Link entity.
 *
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
 */
export type LinkEntity = BaseLink<typeof LinkTypes.LINK>;
/**
 * A Mention entity.
 *
 * Per the ActivityPub spec:
 *
 * > A Mention is a specialization of Link that represents an @mention.
 *
 * @extends Link
 *
 * @see https://www.w3.org/TR/activitypub/#mention
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
