import { AllTypes, ExtendedObjectTypes } from '../util/const';
import { BaseCoreObject } from '../Core/CoreObject';
import { EntityReference, CoreObjectReference } from '../Core';
import { TypeOrArrayWithType } from '../Core/Entity';

type BaseExtendedObject = BaseCoreObject & {
  type: TypeOrArrayWithType<
    typeof ExtendedObjectTypes[keyof typeof ExtendedObjectTypes]
  >;
};

export type Tombstone = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.TOMBSTONE>;
  formerType?:
    | typeof AllTypes[keyof typeof AllTypes]
    | Array<typeof AllTypes[keyof typeof AllTypes]>;
  deleted?: Date;
};

export type Relationship = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.RELATIONSHIP>;
  subject?: EntityReference;
  object?: EntityReference | EntityReference[];
  relationship?: CoreObjectReference;
};

export type Article = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.ARTICLE>;
};

export type Note = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.NOTE>;
};

export type Page = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.PAGE>;
};

export type Event = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.EVENT>;
};

export type Place = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.PLACE>;
  accuracy?: number;
  altitude?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  units?: string;
};

export type Document = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.DOCUMENT>;
};

export type Image = Document & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.IMAGE>;
};

export type Audio = Document & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.AUDIO>;
};

export type Video = Document & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.VIDEO>;
};

export type Profile = BaseExtendedObject & {
  type: TypeOrArrayWithType<typeof ExtendedObjectTypes.PROFILE>;
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
