import { BaseEntity } from './Entity';
import { LinkTypes, OrArray, StringReferenceMap } from '../util';
import { EntityReference } from '.';

export type AnyLinkType = (typeof LinkTypes)[keyof typeof LinkTypes];

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > A Link is an indirect, qualified reference to a resource identified by a URL.
 * > The fundamental model for links is established by [RFC5988]. Many of the
 * > properties defined by the Activity Vocabulary allow values that are either
 * > instances of Object or Link. When a Link is used, it establishes a qualified
 * > relation connecting the subject (the containing object) to the resource
 * > identified by the href. Properties of the Link are properties of the reference
 * > as opposed to properties of the resource.
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

export type BaseLink<T extends AnyLinkType> = BaseEntity<T> & LinkProperties;

type LinkEntity = BaseLink<typeof LinkTypes.LINK>;
export type Mention = BaseLink<typeof LinkTypes.MENTION>;

export type Link = LinkEntity | Mention;
export type LinkReference = URL | Link;
