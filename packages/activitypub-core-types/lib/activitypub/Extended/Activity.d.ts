/// <reference types="node" />
import { BaseCoreObject } from '../Core/CoreObject';
import { ActivityTypes } from '../util/const';
import { EntityReference } from '../Core';
declare type BaseActivity = BaseCoreObject & {
  type: typeof ActivityTypes[keyof typeof ActivityTypes];
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
  type: typeof ActivityTypes.ACCEPT;
};
export declare type TentativeAccept = Accept & {
  type: typeof ActivityTypes.TENTATIVE_ACCEPT;
};
export declare type Add = BaseActivity & {
  type: typeof ActivityTypes.ADD;
};
export declare type Arrive = IntransitiveActivity & {
  type: typeof ActivityTypes.ARRIVE;
};
export declare type Create = BaseActivity & {
  type: typeof ActivityTypes.CREATE;
};
export declare type Delete = BaseActivity & {
  type: typeof ActivityTypes.DELETE;
};
export declare type Follow = BaseActivity & {
  type: typeof ActivityTypes.FOLLOW;
};
export declare type Ignore = BaseActivity & {
  type: typeof ActivityTypes.IGNORE;
};
export declare type Join = BaseActivity & {
  type: typeof ActivityTypes.JOIN;
};
export declare type Leave = BaseActivity & {
  type: typeof ActivityTypes.LEAVE;
};
export declare type Like = BaseActivity & {
  type: typeof ActivityTypes.LIKE;
};
export declare type Offer = BaseActivity & {
  type: typeof ActivityTypes.OFFER;
};
export declare type Invite = Offer & {
  type: typeof ActivityTypes.INVITE;
};
export declare type Reject = BaseActivity & {
  type: typeof ActivityTypes.REJECT;
};
export declare type TentativeReject = Reject & {
  type: typeof ActivityTypes.TENTATIVE_REJECT;
};
export declare type Remove = BaseActivity & {
  type: typeof ActivityTypes.REMOVE;
};
export declare type Undo = BaseActivity & {
  type: typeof ActivityTypes.UNDO;
};
export declare type Update = BaseActivity & {
  type: typeof ActivityTypes.UPDATE;
};
export declare type View = BaseActivity & {
  type: typeof ActivityTypes.VIEW;
};
export declare type Listen = BaseActivity & {
  type: typeof ActivityTypes.LISTEN;
};
export declare type Read = BaseActivity & {
  type: typeof ActivityTypes.READ;
};
export declare type Move = BaseActivity & {
  type: typeof ActivityTypes.MOVE;
};
export declare type Travel = IntransitiveActivity & {
  type: typeof ActivityTypes.TRAVEL;
};
export declare type Announce = BaseActivity & {
  type: typeof ActivityTypes.ANNOUNCE;
};
export declare type Block = Ignore & {
  type: typeof ActivityTypes.BLOCK;
};
export declare type Flag = BaseActivity & {
  type: typeof ActivityTypes.FLAG;
};
export declare type Dislike = BaseActivity & {
  type: typeof ActivityTypes.DISLIKE;
};
export declare type Question = IntransitiveActivity & {
  type: typeof ActivityTypes.QUESTION;
  oneOf: EntityReference | EntityReference[];
  anyOf: EntityReference | EntityReference[];
  closed: EntityReference | Date | boolean;
};
export declare type Activity =
  | Accept
  | Follow
  | Delete
  | Create
  | Arrive
  | Add
  | Offer
  | Like
  | Leave
  | Ignore
  | Join
  | Reject
  | Invite
  | TentativeReject
  | TentativeAccept
  | View
  | Update
  | Undo
  | Remove
  | Read
  | Listen
  | Move
  | Travel
  | Announce
  | Block
  | Flag
  | Dislike
  | Question;
export declare type ActivityReference = URL | Activity;
export {};
