/// <reference types="node" />
import { ExtendedObjectTypes, OrArray, AnyType, TypeOrArrayWithType } from '../util';
import { CoreObjectProperties } from '../Core/CoreObject';
import { EntityReference, CoreObjectReference } from '../Core';
import { BaseEntity } from '../Core/Entity';
export type AnyExtendedObjectType = (typeof ExtendedObjectTypes)[keyof typeof ExtendedObjectTypes];
export type BaseExtendedObject<T extends AnyExtendedObjectType> = BaseEntity<T> & CoreObjectProperties;
export type Tombstone = BaseExtendedObject<typeof ExtendedObjectTypes.TOMBSTONE> & {
    formerType?: TypeOrArrayWithType<AnyType>;
    deleted?: Date;
};
export type Relationship = BaseExtendedObject<typeof ExtendedObjectTypes.RELATIONSHIP> & {
    subject?: EntityReference;
    object?: OrArray<EntityReference>;
    relationship?: CoreObjectReference;
};
export type Article = BaseExtendedObject<typeof ExtendedObjectTypes.ARTICLE>;
export type Note = BaseExtendedObject<typeof ExtendedObjectTypes.NOTE>;
export type Page = BaseExtendedObject<typeof ExtendedObjectTypes.PAGE>;
export type Event = BaseExtendedObject<typeof ExtendedObjectTypes.EVENT>;
export type Place = BaseExtendedObject<typeof ExtendedObjectTypes.PLACE> & {
    accuracy?: number;
    altitude?: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
    units?: string;
};
export type Document = BaseExtendedObject<typeof ExtendedObjectTypes.DOCUMENT>;
export type Image = BaseExtendedObject<typeof ExtendedObjectTypes.IMAGE>;
export type Audio = BaseExtendedObject<typeof ExtendedObjectTypes.AUDIO>;
export type Video = BaseExtendedObject<typeof ExtendedObjectTypes.VIDEO>;
export type Profile = BaseExtendedObject<typeof ExtendedObjectTypes.PROFILE> & {
    describes?: CoreObjectReference;
};
export type Hashtag = BaseExtendedObject<typeof ExtendedObjectTypes.HASHTAG>;
export type ExtendedObject = Article | Event | Note | Page | Place | Relationship | Tombstone | Profile | Video | Document | Audio | Image | Hashtag;
export type ExtendedObjectReference = URL | ExtendedObject;
export type ImageReference = URL | Image;
