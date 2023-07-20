import {
  ActivityTypes,
  OrArray,
  TransitiveActivityTypes,
  IntransitiveActivityTypes,
} from '../util';
import { CoreObjectProperties, EntityReference } from '../Core';
import { BaseEntity } from '../Core/Entity';

export type AnyActivityType =
  (typeof ActivityTypes)[keyof typeof ActivityTypes];

export type AnyTransitiveActivityType =
  (typeof TransitiveActivityTypes)[keyof typeof TransitiveActivityTypes];

export type AnyIntransitiveActivityType =
  (typeof IntransitiveActivityTypes)[keyof typeof IntransitiveActivityTypes];

export type ActivityProperties = {
  actor: OrArray<EntityReference>;
  object?: OrArray<EntityReference>;
  target?: OrArray<EntityReference>;
  result?: OrArray<EntityReference>;
  origin?: OrArray<EntityReference>;
  instrument?: OrArray<EntityReference>;
};

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > An Activity is a subtype of Object that describes some form of action that
 * > may happen, is currently happening, or has already happened. The Activity
 * > type itself serves as an abstract base type for all types of activities.
 * > It is important to note that the Activity type itself does not carry any
 * > specific semantics about the kind of action being taken.
 */

type BaseActivity<T extends AnyActivityType> = BaseEntity<T> &
  CoreObjectProperties &
  ActivityProperties;

type TransitiveActivityProperties = {
  object: OrArray<EntityReference>;
};

// Not part of the spec, but helpful in some situations.
export type TransitiveActivity<T extends AnyTransitiveActivityType> =
  BaseActivity<T> & TransitiveActivityProperties;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Instances of IntransitiveActivity are a subtype of Activity representing
 * > intransitive actions. The object property is therefore inappropriate for
 * > these activities.
 */
export type IntransitiveActivity<T extends AnyIntransitiveActivityType> =
  BaseActivity<T>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * All Activity Types inherit the properties of the base Activity type.
 * Some specific Activity Types are subtypes or specializations of more
 * generalized Activity Types (for instance, the Invite Activity Type
 * is a more specific form of the Offer Activity Type).
 */

export type Accept = TransitiveActivity<typeof ActivityTypes.ACCEPT>;

export type TentativeAccept = TransitiveActivity<
  typeof ActivityTypes.TENTATIVE_ACCEPT
>;

export type Add = TransitiveActivity<typeof ActivityTypes.ADD>;

export type Arrive = IntransitiveActivity<typeof ActivityTypes.ARRIVE>;

export type Create = TransitiveActivity<typeof ActivityTypes.CREATE>;

export type Delete = TransitiveActivity<typeof ActivityTypes.DELETE>;

export type Follow = TransitiveActivity<typeof ActivityTypes.FOLLOW>;

export type Ignore = TransitiveActivity<typeof ActivityTypes.IGNORE>;

export type Join = TransitiveActivity<typeof ActivityTypes.JOIN>;

export type Leave = TransitiveActivity<typeof ActivityTypes.LEAVE>;

export type Like = TransitiveActivity<typeof ActivityTypes.LIKE>;

export type Offer = TransitiveActivity<typeof ActivityTypes.OFFER>;

export type Invite = TransitiveActivity<typeof ActivityTypes.INVITE>;

export type Reject = TransitiveActivity<typeof ActivityTypes.REJECT>;

export type TentativeReject = TransitiveActivity<
  typeof ActivityTypes.TENTATIVE_REJECT
>;

export type Remove = TransitiveActivity<typeof ActivityTypes.REMOVE>;

export type Undo = TransitiveActivity<typeof ActivityTypes.UNDO>;

export type Update = TransitiveActivity<typeof ActivityTypes.UPDATE>;

export type View = TransitiveActivity<typeof ActivityTypes.VIEW>;

export type Listen = TransitiveActivity<typeof ActivityTypes.LISTEN>;

export type Read = TransitiveActivity<typeof ActivityTypes.READ>;

export type Move = TransitiveActivity<typeof ActivityTypes.MOVE>;

export type Travel = IntransitiveActivity<typeof ActivityTypes.TRAVEL>;

export type Announce = TransitiveActivity<typeof ActivityTypes.ANNOUNCE>;

export type Block = TransitiveActivity<typeof ActivityTypes.BLOCK>;

export type Flag = TransitiveActivity<typeof ActivityTypes.FLAG>;

export type Dislike = TransitiveActivity<typeof ActivityTypes.DISLIKE>;

export type Question = IntransitiveActivity<typeof ActivityTypes.QUESTION> & {
  oneOf: OrArray<EntityReference>;
  anyOf: OrArray<EntityReference>;
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
