import { AllTypes, ExtendedObjectTypes } from '../util/const';
import { BaseCoreObject } from '../Core/CoreObject';
import { EntityReference, CoreObjectReference } from '../Core';

type BaseExtendedObject = BaseCoreObject & {
  type: typeof ExtendedObjectTypes[keyof typeof ExtendedObjectTypes];
};

export type Tombstone = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.TOMBSTONE;
  formerType?:
  | typeof AllTypes[keyof typeof AllTypes]
  | Array<typeof AllTypes[keyof typeof AllTypes]>;
  deleted?: Date;
};

export type Relationship = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.RELATIONSHIP;
  subject?: EntityReference;
  object?: EntityReference | EntityReference[];
  relationship?: CoreObjectReference;
};

export type Article = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.ARTICLE;
};

export type Note = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.NOTE;
};

export type Page = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.PAGE;
};

export type Event = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.EVENT;
};

export type Place = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.PLACE;
  accuracy?: number;
  altitude?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  units?: string;
};

export type Document = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.DOCUMENT;
};

export type Image = Document & {
  type: typeof ExtendedObjectTypes.IMAGE;
};

export type Audio = Document & {
  type: typeof ExtendedObjectTypes.IMAGE;
};

export type Video = Document & {
  type: typeof ExtendedObjectTypes.IMAGE;
};

export type Profile = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.PROFILE;
  describes?: CoreObjectReference;
};

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
  | Image;
export type ExtendedObjectReference = URL | ExtendedObject;
export type ImageReference = URL | Image;
