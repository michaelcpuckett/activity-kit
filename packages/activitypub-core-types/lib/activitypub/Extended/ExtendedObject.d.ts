import { ExtendedObjectTypes } from '../util/const';
import { BaseCoreObject } from '../Core/CoreObject';
import { EntityReference, CoreObjectReference } from '../Core';
import { AnyType, TypeOrArrayWithType } from '../Core/Entity';
declare type BaseExtendedObject = BaseCoreObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes[keyof typeof ExtendedObjectTypes]>;
};
export declare type Tombstone = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.TOMBSTONE>;
    formerType?: TypeOrArrayWithType<AnyType>;
    deleted?: Date;
};
export declare type Relationship = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.RELATIONSHIP>;
    subject?: EntityReference;
    object?: EntityReference | EntityReference[];
    relationship?: CoreObjectReference;
};
export declare type Article = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.ARTICLE>;
};
export declare type Note = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.NOTE>;
};
export declare type Page = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.PAGE>;
};
export declare type Event = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.EVENT>;
};
export declare type Place = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.PLACE>;
    accuracy?: number;
    altitude?: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
    units?: string;
};
export declare type Document = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.DOCUMENT>;
};
export declare type Image = Document & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.IMAGE>;
};
export declare type Audio = Document & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.AUDIO>;
};
export declare type Video = Document & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.VIDEO>;
};
export declare type Profile = BaseExtendedObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.PROFILE>;
    describes?: CoreObjectReference;
};
export declare type Hashtag = BaseCoreObject & {
    type: TypeOrArrayWithType<typeof ExtendedObjectTypes.HASHTAG>;
};
export declare type ExtendedObject = Article | Event | Note | Page | Place | Relationship | Tombstone | Profile | Video | Document | Audio | Image | Hashtag;
export declare type ExtendedObjectReference = URL | ExtendedObject;
export declare type ImageReference = URL | Image;
export {};
