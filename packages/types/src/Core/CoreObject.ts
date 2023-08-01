import { CoreObjectTypes, OrArray } from '../util';
import type { EntityReference } from '.';
import type { StringReferenceMap } from '../util/values';
import type { ImageReference } from '../Extended/ExtendedObject';
import type { LinkReference } from './Link';
import type {
  CollectionReference,
  OrderedCollectionReference,
} from '../Extended/Collection';

/**
 * A union of all Core Object types.
 */
export type AnyCoreObjectType =
  (typeof CoreObjectTypes)[keyof typeof CoreObjectTypes];

/**
 * Properties common to all Core Objects.
 *
 * @see https://www.w3.org/TR/activitystreams-core/#object
 *
 * @note The `sensitive` property is not included in the spec, but it is
 * included because it is common to all ActivityPub objects in practice
 * by way of an extension to the spec.
 */
export type CoreObjectProperties = {
  // Activity Streams properties.
  attachment?: OrArray<EntityReference>;
  attributedTo?: OrArray<EntityReference>;
  audience?: OrArray<EntityReference>;
  bcc?: OrArray<EntityReference>;
  bto?: OrArray<EntityReference>;
  cc?: OrArray<EntityReference>;
  content?: string;
  contentMap?: StringReferenceMap;
  context?: OrArray<EntityReference>;
  duration?: string;
  endTime?: Date;
  generator?: OrArray<EntityReference>;
  icon?: OrArray<ImageReference | LinkReference>;
  image?: OrArray<ImageReference | LinkReference>;
  inReplyTo?: OrArray<EntityReference>;
  location?: OrArray<EntityReference>;
  mediaType?: string;
  name?: string;
  nameMap?: StringReferenceMap;
  preview?: OrArray<EntityReference>;
  published?: Date;
  replies?: CollectionReference;
  startTime?: Date;
  summary?: string;
  summaryMap?: StringReferenceMap;
  tag?: OrArray<EntityReference>;
  to?: OrArray<EntityReference>;
  updated?: Date;
  url?: OrArray<LinkReference>;

  // ActivityPub
  likes?: OrderedCollectionReference;
  shares?: OrderedCollectionReference;
  source?: {
    content?: string;
    contentMap?: StringReferenceMap;
  };

  // Extension
  sensitive?: boolean;
};
