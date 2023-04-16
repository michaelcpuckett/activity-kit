import { BaseEntity, TypeOrArrayWithType } from './Entity';
import { LinkTypes } from '../util/const';
import { StringReferenceMap } from '../util/values';
import { EntityReference } from '.';

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

export interface BaseLink extends BaseEntity {
  type: TypeOrArrayWithType<typeof LinkTypes[keyof typeof LinkTypes]>;
  height?: number;
  href?: URL;
  hrefLang?: string;
  mediaType?: string;
  name?: string;
  nameMap?: StringReferenceMap;
  preview?: EntityReference | EntityReference[];
  rel?: string | string[];
  width?: number;
}

export interface Mention extends BaseLink {
  type: typeof LinkTypes.MENTION;
}

export type Link = BaseLink | Mention;
export type LinkReference = URL | Link;
