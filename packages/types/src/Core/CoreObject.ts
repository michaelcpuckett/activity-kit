import { CoreObjectTypes, OrArray } from '../util';
import type { EntityReference } from '.';
import type { StringReferenceMap } from '../util/values';
import type { ImageReference } from '../Extended/ExtendedObject';
import type { LinkReference } from './Link';
import type {
  CollectionReference,
  OrderedCollectionReference,
} from '../Extended/Collection';

export type AnyCoreObjectType =
  (typeof CoreObjectTypes)[keyof typeof CoreObjectTypes];

/**
 * Objects are the core concept around which both ActivityStreams and ActivityPub
 * are built. Objects are often wrapped in Activities and are contained in streams
 * of Collections, which are themselves subclasses of Objects. See the
 * Activity-Vocabulary document, particularly the Core Classes; ActivityPub follows
 * the mapping of this vocabulary very closely.
 *
 * ActivityPub defines some terms in addition to those provided by ActivityStreams.
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
  icon?: ImageReference | LinkReference | Array<ImageReference | LinkReference>;
  image?:
    | ImageReference
    | LinkReference
    | Array<ImageReference | LinkReference>;
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
