import {
  ExtendedObjectTypes,
  OrArray,
  AnyType,
  TypeOrArrayWithType,
} from '../util';
import { CoreObjectProperties } from '../Core/CoreObject';
import { EntityReference, CoreObjectReference } from '../Core';
import { BaseEntity } from '../Core/Entity';

/**
 * A union of all Extended Object types.
 */
export type AnyExtendedObjectType =
  (typeof ExtendedObjectTypes)[keyof typeof ExtendedObjectTypes];

/**
 * The base type for all Extended Object entities.
 *
 * @extends BaseEntity
 * @extends CoreObjectProperties
 *
 * @instance Article
 * @instance Event
 * @instance Note
 * @instance Page
 * @instance Place
 * @instance Relationship
 * @instance Tombstone
 * @instance Profile
 * @instance Video
 * @instance Document
 * @instance Audio
 * @instance Image
 * @instance Hashtag
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#extended-types
 */
export type BaseExtendedObject<T extends AnyExtendedObjectType> =
  BaseEntity<T> & CoreObjectProperties;

/**
 * Per the ActivityStreams spec:
 *
 * > A Tombstone is a special kind of Object that represents a content object
 * > that has been deleted. It can be used in Collections to signify that there
 * > used to be an object at this position, but it has been deleted.
 *
 * @extends BaseExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-tombstone
 */
export type Tombstone = BaseExtendedObject<
  typeof ExtendedObjectTypes.TOMBSTONE
> & {
  formerType?: TypeOrArrayWithType<AnyType>;
  deleted?: Date;
};

/**
 * Per the ActivityStreams spec:
 *
 * > A Relationship is an indirect Entity that describes a relationship between
 * > two individuals. The subject and object properties are used to identify the
 * > connected individuals.
 *
 * @extends BaseExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-relationship
 */
export type Relationship = BaseExtendedObject<
  typeof ExtendedObjectTypes.RELATIONSHIP
> & {
  subject?: EntityReference;
  object?: OrArray<EntityReference>;
  relationship?: CoreObjectReference;
};

/**
 * Per the ActivityStreams spec:
 *
 * > A Profile is a content object that describes another Object, typically used
 * > to describe Actor Type objects. The describes property is used to reference
 * > the object being described by the profile.
 *
 * @extends BaseExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-profile
 */
export type Article = BaseExtendedObject<typeof ExtendedObjectTypes.ARTICLE>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents a short written work typically less than a single paragraph in
 * > length.
 *
 * @extends BaseExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note
 */
export type Note = BaseExtendedObject<typeof ExtendedObjectTypes.NOTE>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents a Web Page.
 *
 * @extends BaseExtendedObject
 *
 * @note Technically this extends Document, but Document has no special
 * properties.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-page
 */
export type Page = BaseExtendedObject<typeof ExtendedObjectTypes.PAGE>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents any kind of event.
 *
 * @extends BaseExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-event
 */
export type Event = BaseExtendedObject<typeof ExtendedObjectTypes.EVENT>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents a logical or physical location.
 *
 * Additionally, per the spec:
 *
 * > The Place object is used to represent both physical and logical locations.
 * > While numerous existing vocabularies exist for describing locations in a
 * > variety of ways, inconsistencies and incompatibilities between those
 * > vocabularies make it difficult to achieve appropriate interoperability
 * > between implementations. The Place object is included within the Activity
 * > vocabulary to provide a minimal, interoperable starting point for
 * > describing locations consistently across Activity Streams 2.0
 * > implementations.
 *
 * @extends BaseExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-place
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#places
 */
export type Place = BaseExtendedObject<typeof ExtendedObjectTypes.PLACE> & {
  accuracy?: number;
  altitude?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  units?: string;
};

/**
 * Per the ActivityStreams spec:
 *
 * > A Document is a content object that represents another resource, typically
 * > used to describe things that are capable of being embedded or attached to
 * > other content.
 *
 * @extends BaseExtendedObject
 *
 * @note Technically several other types extend Document, but Document has no
 * special properties. The types include: Image, Audio, Video, and Profile.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-document
 */
export type Document = BaseExtendedObject<typeof ExtendedObjectTypes.DOCUMENT>;

/**
 * Per the ActivityStreams spec:
 *
 * > An image document of any kind.
 *
 * @extends BaseExtendedObject
 *
 * @note Technically this extends Document, but Document has no special
 * properties.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-image
 */
export type Image = BaseExtendedObject<typeof ExtendedObjectTypes.IMAGE>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents an audio document of any kind.
 *
 * @extends BaseExtendedObject
 *
 * @note Technically this extends Document, but Document has no special
 * properties.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-audio
 */
export type Audio = BaseExtendedObject<typeof ExtendedObjectTypes.AUDIO>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents a video document of any kind.
 *
 * @extends BaseExtendedObject
 *
 * @note Technically this extends Document, but Document has no special
 * properties.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-video
 */
export type Video = BaseExtendedObject<typeof ExtendedObjectTypes.VIDEO>;

/**
 * Per the ActivityStreams spec:
 *
 * > A Profile is a content object that describes another Object, typically used
 * > to describe Actor Type objects. The describes property is used to reference
 * > the object being described by the profile.
 *
 * @extends BaseExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-profile
 */
export type Profile = BaseExtendedObject<typeof ExtendedObjectTypes.PROFILE> & {
  describes?: CoreObjectReference;
};

/**
 * A hashtag.
 *
 * @extends BaseExtendedObject
 *
 * @note This is not part of the ActivityPub spec, but it is common in practice
 * by way of extensions to the spec.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-hashtag
 */
export type Hashtag = BaseExtendedObject<typeof ExtendedObjectTypes.HASHTAG>;

/**
 * A union of all Extended Object types.
 *
 * @extends BaseEntity
 * @extends BaseExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#extendedtypes
 */
export type ExtendedObject =
  | Article
  | Event
  | Note
  | Page
  | Place
  | Relationship
  | Tombstone
  | Profile
  | Video
  | Document
  | Audio
  | Image
  | Hashtag;
export type ExtendedObjectReference = URL | ExtendedObject;
export type ImageReference = URL | Image;
