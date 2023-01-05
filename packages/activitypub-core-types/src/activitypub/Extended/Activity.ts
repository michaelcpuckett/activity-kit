import { BaseCoreObject } from '../Core/CoreObject';
import { ActivityTypes } from '../util/const';
import { EntityReference } from '../Core';
import { AnyType, TypeOrArrayWithType } from '../Core/Entity';

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > An Activity is a subtype of Object that describes some form of action that
 * > may happen, is currently happening, or has already happened. The Activity
 * > type itself serves as an abstract base type for all types of activities.
 * > It is important to note that the Activity type itself does not carry any
 * > specific semantics about the kind of action being taken.
 */

type BaseActivity = BaseCoreObject & {
  type: TypeOrArrayWithType<typeof ActivityTypes[keyof typeof ActivityTypes]>;
  actor: EntityReference | EntityReference[];
  object?: EntityReference | EntityReference[];
  target?: EntityReference | EntityReference[];
  result?: EntityReference | EntityReference[];
  origin?: EntityReference | EntityReference[];
  instrument?: EntityReference | EntityReference[];
};

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Instances of IntransitiveActivity are a subtype of Activity representing
 * > intransitive actions. The object property is therefore inappropriate for
 * > these activities.
 */
export type IntransitiveActivity = Omit<BaseActivity, 'object'>;

// Not part of the spec, but helpful in some situations.
export type TransitiveActivity = BaseActivity & {
  object: EntityReference | EntityReference[];
};

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * All Activity Types inherit the properties of the base Activity type.
 * Some specific Activity Types are subtypes or specializations of more
 * generalized Activity Types (for instance, the Invite Activity Type
 * is a more specific form of the Offer Activity Type).
 */

export type Accept = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.ACCEPT>;
};

export type TentativeAccept = Accept & {
  type: TypeOrArrayWithType<typeof ActivityTypes.TENTATIVE_ACCEPT>;
};

export type Add = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.ADD>;
};

export type Arrive = IntransitiveActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.ARRIVE>;
};

export type Create = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.CREATE>;
};

export type Delete = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.DELETE>;
};

export type Follow = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.FOLLOW>;
};

export type Ignore = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.IGNORE>;
};

export type Join = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.JOIN>;
};

export type Leave = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.LEAVE>;
};

export type Like = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.LIKE>;
};

export type Offer = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.OFFER>;
};

export type Invite = Offer & {
  type: TypeOrArrayWithType<typeof ActivityTypes.INVITE>;
};

export type Reject = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.REJECT>;
};

export type TentativeReject = Reject & {
  type: TypeOrArrayWithType<typeof ActivityTypes.TENTATIVE_REJECT>;
};

export type Remove = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.REMOVE>;
};

export type Undo = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.UNDO>;
};

export type Update = BaseActivity & {
  type: typeof ActivityTypes.UPDATE;
};

export type View = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.VIEW>;
};

export type Listen = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.LISTEN>;
};

export type Read = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.READ>;
};

export type Move = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.MOVE>;
};

export type Travel = IntransitiveActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.TRAVEL>;
};

export type Announce = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.ANNOUNCE>;
};

export type Block = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.BLOCK>;
};

export type Flag = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.FLAG>;
};

export type Dislike = BaseActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.DISLIKE>;
};

export type Question = IntransitiveActivity & {
  type: TypeOrArrayWithType<typeof ActivityTypes.QUESTION>;
  oneOf: EntityReference | EntityReference[];
  anyOf: EntityReference | EntityReference[];
  closed: EntityReference | Date | boolean;
};

export type Activity =
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

export type ActivityReference = URL | Activity;
