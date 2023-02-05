import { BaseCoreObject } from '../Core/CoreObject';
import { ActivityTypes } from '../util/const';
import { EntityReference } from '../Core';
import { TypeOrArrayWithType } from '../Core/Entity';
declare type BaseActivity = BaseCoreObject & {
    type: TypeOrArrayWithType<typeof ActivityTypes[keyof typeof ActivityTypes]>;
    actor: EntityReference | EntityReference[];
    object?: EntityReference | EntityReference[];
    target?: EntityReference | EntityReference[];
    result?: EntityReference | EntityReference[];
    origin?: EntityReference | EntityReference[];
    instrument?: EntityReference | EntityReference[];
};
export declare type IntransitiveActivity = Omit<BaseActivity, 'object'>;
export declare type TransitiveActivity = BaseActivity & {
    object: EntityReference | EntityReference[];
};
export declare type Accept = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.ACCEPT>;
};
export declare type TentativeAccept = Accept & {
    type: TypeOrArrayWithType<typeof ActivityTypes.TENTATIVE_ACCEPT>;
};
export declare type Add = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.ADD>;
};
export declare type Arrive = IntransitiveActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.ARRIVE>;
};
export declare type Create = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.CREATE>;
};
export declare type Delete = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.DELETE>;
};
export declare type Follow = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.FOLLOW>;
};
export declare type Ignore = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.IGNORE>;
};
export declare type Join = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.JOIN>;
};
export declare type Leave = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.LEAVE>;
};
export declare type Like = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.LIKE>;
};
export declare type Offer = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.OFFER>;
};
export declare type Invite = Offer & {
    type: TypeOrArrayWithType<typeof ActivityTypes.INVITE>;
};
export declare type Reject = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.REJECT>;
};
export declare type TentativeReject = Reject & {
    type: TypeOrArrayWithType<typeof ActivityTypes.TENTATIVE_REJECT>;
};
export declare type Remove = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.REMOVE>;
};
export declare type Undo = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.UNDO>;
};
export declare type Update = BaseActivity & {
    type: typeof ActivityTypes.UPDATE;
};
export declare type View = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.VIEW>;
};
export declare type Listen = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.LISTEN>;
};
export declare type Read = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.READ>;
};
export declare type Move = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.MOVE>;
};
export declare type Travel = IntransitiveActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.TRAVEL>;
};
export declare type Announce = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.ANNOUNCE>;
};
export declare type Block = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.BLOCK>;
};
export declare type Flag = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.FLAG>;
};
export declare type Dislike = BaseActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.DISLIKE>;
};
export declare type Question = IntransitiveActivity & {
    type: TypeOrArrayWithType<typeof ActivityTypes.QUESTION>;
    oneOf: EntityReference | EntityReference[];
    anyOf: EntityReference | EntityReference[];
    closed: EntityReference | Date | boolean;
};
export declare type Activity = Accept | Follow | Delete | Create | Arrive | Add | Offer | Like | Leave | Ignore | Join | Reject | Invite | TentativeReject | TentativeAccept | View | Update | Undo | Remove | Read | Listen | Move | Travel | Announce | Block | Flag | Dislike | Question;
export declare type ActivityReference = URL | Activity;
export {};
