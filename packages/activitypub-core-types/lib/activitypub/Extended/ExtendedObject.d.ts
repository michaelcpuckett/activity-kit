/// <reference types="node" />
import { AllTypes, ExtendedObjectTypes } from '../util/const';
import { BaseCoreObject } from '../Core/CoreObject';
import { EntityReference, CoreObjectReference } from '../Core';
declare type BaseExtendedObject = BaseCoreObject & {
  type: typeof ExtendedObjectTypes[keyof typeof ExtendedObjectTypes];
};
export declare type Tombstone = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.TOMBSTONE;
  formerType?:
    | typeof AllTypes[keyof typeof AllTypes]
    | Array<typeof AllTypes[keyof typeof AllTypes]>;
  deleted?: Date;
};
export declare type Relationship = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.RELATIONSHIP;
  subject?: EntityReference;
  object?: EntityReference | EntityReference[];
  relationship?: CoreObjectReference;
};
export declare type Article = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.ARTICLE;
};
export declare type Note = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.NOTE;
};
export declare type Page = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.PAGE;
};
export declare type Event = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.EVENT;
};
export declare type Place = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.PLACE;
  accuracy?: number;
  altitude?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  units?: string;
};
export declare type Document = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.DOCUMENT;
};
export declare type Image = Document & {
  type: typeof ExtendedObjectTypes.IMAGE;
};
export declare type Audio = Document & {
  type: typeof ExtendedObjectTypes.IMAGE;
};
export declare type Video = Document & {
  type: typeof ExtendedObjectTypes.IMAGE;
};
export declare type Profile = BaseExtendedObject & {
  type: typeof ExtendedObjectTypes.PROFILE;
  describes?: CoreObjectReference;
};
export declare type ExtendedObject =
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
export declare type ExtendedObjectReference = URL | ExtendedObject;
export declare type ImageReference = URL | Image;
export {};
