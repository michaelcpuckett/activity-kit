import { CoreObjectTypes } from '../util/const';
import type { BaseEntity, TypeOrArrayWithType } from './Entity';
import type { EntityReference } from '.';
import type { StringReferenceMap } from '../util/values';
import type { ImageReference } from '../Extended/ExtendedObject';
import type { LinkReference } from './Link';
import type {
  CollectionReference,
  OrderedCollectionReference,
} from '../Extended/Collection';

/**
 * Objects are the core concept around which both ActivityStreams and ActivityPub
 * are built. Objects are often wrapped in Activities and are contained in streams
 * of Collections, which are themselves subclasses of Objects. See the
 * Activity-Vocabulary document, particularly the Core Classes; ActivityPub follows
 * the mapping of this vocabulary very closely.
 *
 * ActivityPub defines some terms in addition to those provided by ActivityStreams.
 */

export interface BaseCoreObject extends BaseEntity {
  // Activity Streams properties.
  type: TypeOrArrayWithType<
    typeof CoreObjectTypes[keyof typeof CoreObjectTypes]
  >;
  attachment?: EntityReference | EntityReference[];
  attributedTo?: EntityReference | EntityReference[];
  audience?: EntityReference | EntityReference[];
  bcc?: EntityReference | EntityReference[];
  bto?: EntityReference | EntityReference[];
  cc?: EntityReference | EntityReference[];
  content?: string;
  contentMap?: StringReferenceMap;
  context?: EntityReference | EntityReference[];
  duration?: string;
  endTime?: Date;
  generator?: EntityReference | EntityReference[];
  icon?: ImageReference | ImageReference[] | LinkReference | LinkReference[];
  image?: ImageReference | ImageReference[] | LinkReference | LinkReference[];
  inReplyTo?: EntityReference | EntityReference[];
  location?: EntityReference | EntityReference[];
  mediaType?: string;
  name?: string;
  nameMap?: StringReferenceMap;
  preview?: EntityReference | EntityReference[];
  published?: Date;
  replies?: CollectionReference;
  startTime?: Date;
  summary?: string;
  summaryMap?: StringReferenceMap;
  tag?: EntityReference | EntityReference[];
  to?: EntityReference | EntityReference[];
  updated?: Date;
  url?: LinkReference | LinkReference[];

  // Activity Pub
  likes?: OrderedCollectionReference;
  shares?: OrderedCollectionReference;
  source?: {
    content?: string;
    contentMap?: StringReferenceMap;
  };

  // Extension
  sensitive: boolean;
}
