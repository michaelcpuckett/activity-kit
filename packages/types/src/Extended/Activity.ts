import {
  ActivityTypes,
  OrArray,
  TransitiveActivityTypes,
  IntransitiveActivityTypes,
} from '../util';
import { CoreObjectProperties, EntityReference } from '../Core';
import { BaseEntity } from '../Core/Entity';

/**
 * A union of all Activity types.
 */
export type AnyActivityType =
  (typeof ActivityTypes)[keyof typeof ActivityTypes];

/**
 * A union of all Transitive Activity types.
 */
export type AnyTransitiveActivityType =
  (typeof TransitiveActivityTypes)[keyof typeof TransitiveActivityTypes];

/**
 * A union of all Intransitive Activity types.
 */
export type AnyIntransitiveActivityType =
  (typeof IntransitiveActivityTypes)[keyof typeof IntransitiveActivityTypes];

/**
 * Properties common to all Activity types.
 */
export type ActivityProperties = {
  actor: OrArray<EntityReference>;
  object?: OrArray<EntityReference>;
  target?: OrArray<EntityReference>;
  result?: OrArray<EntityReference>;
  origin?: OrArray<EntityReference>;
  instrument?: OrArray<EntityReference>;
};

/**
 * The base type for all Activity entities.
 *
 * @extends CoreObject
 */
type BaseActivity<T extends AnyActivityType> = BaseEntity<T> &
  CoreObjectProperties &
  ActivityProperties;

/**
 * Properties common to all TransitiveActivity types.
 */
type TransitiveActivityProperties = {
  object: OrArray<EntityReference>;
};

/**
 * The base type for all TransitiveActivity entities, meaning those that have an
 * `object` property.
 *
 * @note This is not in the spec, but it is useful for type checking.
 *
 * Inversing the definition of IntransitiveActivity from the ActivityStreams
 * Vocabulary spec:
 *
 * > Instances of TransitiveActivity are a subtype of Activity representing
 * > transitive actions. The object property is therefore required for these
 * > activities.
 *
 * @extends Activity
 */
export type TransitiveActivity<T extends AnyTransitiveActivityType> =
  BaseActivity<T> & TransitiveActivityProperties;

/**
 * The base type for all IntransitiveActivity entities, meaning those that do
 * not have an `object` property.
 *
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Instances of IntransitiveActivity are a subtype of Activity representing
 * > intransitive actions. The object property is therefore inappropriate for
 * > these activities.
 *
 * @extends Activity
 */
export type IntransitiveActivity<T extends AnyIntransitiveActivityType> =
  BaseActivity<T>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has accepted the object. The target property can
 * > be used in certain circumstances to indicate the context into which the
 * > object has been accepted.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-accept
 *
 * @type TransitiveActivity
 */
export type Accept = TransitiveActivity<typeof ActivityTypes.ACCEPT>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is tentatively accepting the object. The target
 * > property can be used in certain circumstances to indicate the context into
 * > which the object has been accepted.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-tentative-accept
 *
 * @type TransitiveActivity
 */
export type TentativeAccept = TransitiveActivity<
  typeof ActivityTypes.TENTATIVE_ACCEPT
>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has added the object to the target. If the target
 * > property is not explicitly specified, the target would need to be
 * > determined implicitly by context. The origin can be used to identify the
 * > context from which the object originated.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-add
 *
 * @type TransitiveActivity
 */
export type Add = TransitiveActivity<typeof ActivityTypes.ADD>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has arrived at the location. The origin can be
 * > used to identify the context from which the actor originated. The target
 * > typically has no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-arrive
 *
 * @type IntransitiveActivity
 */
export type Arrive = IntransitiveActivity<typeof ActivityTypes.ARRIVE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has created the object.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-create
 *
 * @type TransitiveActivity
 */
export type Create = TransitiveActivity<typeof ActivityTypes.CREATE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has deleted the object. If specified, the origin
 * > indicates the context from which the object was deleted.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-delete
 *
 * @type TransitiveActivity
 */
export type Delete = TransitiveActivity<typeof ActivityTypes.DELETE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is "following" the object. Following is defined in
 * > the sense typically used within Social systems in which the actor is
 * > interested in any activity performed by or on the object. The target and
 * > origin typically have no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-follow
 *
 * @type TransitiveActivity
 */
export type Follow = TransitiveActivity<typeof ActivityTypes.FOLLOW>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is ignoring the object. The target and origin
 * > typically have no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-ignore
 */
export type Ignore = TransitiveActivity<typeof ActivityTypes.IGNORE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has joined the object. The target and origin
 * > typically have no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-join
 *
 * @type TransitiveActivity
 */
export type Join = TransitiveActivity<typeof ActivityTypes.JOIN>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is leaving the object. If specified, the origin
 * > indicates the context from which the actor is leaving.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-leave
 *
 * @type TransitiveActivity
 */
export type Leave = TransitiveActivity<typeof ActivityTypes.LEAVE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor likes, recommends or endorses the object. The
 * > target and origin typically have no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-like
 *
 * @type TransitiveActivity
 */
export type Like = TransitiveActivity<typeof ActivityTypes.LIKE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is offering the object. If specified, the target
 * > indicates the entity to which the object is being offered.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-offer
 *
 * @type TransitiveActivity
 */
export type Offer = TransitiveActivity<typeof ActivityTypes.OFFER>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is inviting the object to target. If the origin
 * > property is not specified, the target is notified directly. For instance,
 * > Alice can invite Joe to an event by posting an Invite object to her
 * > personal stream or by mentioning him, effectively inviting him to the
 * > event.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-invite
 *
 * @type TransitiveActivity
 */
export type Invite = TransitiveActivity<typeof ActivityTypes.INVITE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is rejecting the object. The target and origin
 * > typically have no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-reject
 *
 * @type TransitiveActivity
 */
export type Reject = TransitiveActivity<typeof ActivityTypes.REJECT>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is tentatively rejecting the object. The target
 * > and origin typically have no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-tentative-reject
 *
 * @type TransitiveActivity
 */
export type TentativeReject = TransitiveActivity<
  typeof ActivityTypes.TENTATIVE_REJECT
>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has removed the object. If specified, the origin
 * > indicates the context from which the object was removed.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-remove
 *
 * @type TransitiveActivity
 */
export type Remove = TransitiveActivity<typeof ActivityTypes.REMOVE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is undoing the object. In most cases, the object
 * > will be an Activity describing some previously performed action (for
 * > instance, a person may have previously "liked" an article but, for whatever
 * > reason, might choose to undo that like at some later point in time).
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-undo
 *
 * @type TransitiveActivity
 */
export type Undo = TransitiveActivity<typeof ActivityTypes.UNDO>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has updated the object. Note, however, that this
 * > vocabulary does not define a mechanism for describing the actual set of
 * > modifications made to object. The target and origin typically have no
 * > defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-update
 *
 * @type TransitiveActivity
 */
export type Update = TransitiveActivity<typeof ActivityTypes.UPDATE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has viewed the object.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-view
 *
 * @type TransitiveActivity
 */
export type View = TransitiveActivity<typeof ActivityTypes.VIEW>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has listened to the object.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-listen
 *
 * @type TransitiveActivity
 */
export type Listen = TransitiveActivity<typeof ActivityTypes.LISTEN>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has read the object.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-read
 *
 * @type TransitiveActivity
 */
export type Read = TransitiveActivity<typeof ActivityTypes.READ>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has moved object from origin to target. If the
 * > origin or target are not specified, either can be determined by context.
 * > The origin SHOULD NOT be used to express hierarchical or containment
 * > relationships. For example, when moving an object from one folder to
 * > another, leave origin out (instead of making the origin the containing
 * > folder).
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-move
 *
 * @type TransitiveActivity
 */
export type Move = TransitiveActivity<typeof ActivityTypes.MOVE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is traveling to target from origin. Travel is an
 * > IntransitiveObject whose actor specifies the direct object. If the target
 * > or origin are not specified, either can be determined by context. Travel
 * > indicates that the actor is moving to the target from the origin. The
 * > duration and distance properties can be used to indicate the time or
 * > distance of the travel, but they are not necessary. If a matching
 * > IntransitiveActivity object exists, then the Travel object is considered an
 * > alternate view of the same activity.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-travel
 *
 * @type IntransitiveActivity
 */
export type Travel = IntransitiveActivity<typeof ActivityTypes.TRAVEL>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor has announced an object to the target. The
 * > origin typically has no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-announce
 *
 * @type TransitiveActivity
 */
export type Announce = TransitiveActivity<typeof ActivityTypes.ANNOUNCE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is blocking the object. Blocking is a stronger
 * > form of Ignore. The typical use is to support social systems that allow
 * > one user to block activities or content of other users. The target and
 * > origin typically have no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-block
 *
 * @type TransitiveActivity
 */
export type Block = TransitiveActivity<typeof ActivityTypes.BLOCK>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor is "flagging" the object. Flagging is defined in
 * > the sense common to many social platforms as reporting content as being
 * > inappropriate for any number of reasons.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-flag
 *
 * @type TransitiveActivity
 */
export type Flag = TransitiveActivity<typeof ActivityTypes.FLAG>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > Indicates that the actor dislikes the object. The target and origin
 * > typically have no defined meaning.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-dislike
 *
 * @type TransitiveActivity
 */
export type Dislike = TransitiveActivity<typeof ActivityTypes.DISLIKE>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > A Question is an IntransitiveActivity that indicates that the actor is
 * > asking the target a question. Question objects are an extension of
 * > IntransitiveActivity. That is, the Question object is an Activity, but the
 * > direct object is the question itself and therefore it would not contain an
 * > object property. Either of the anyOf and oneOf properties MAY be used to
 * > express possible answers, but a Question object MUST NOT have both
 * > properties.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-question
 *
 * @type IntransitiveActivity
 */
export type Question = IntransitiveActivity<typeof ActivityTypes.QUESTION> & {
  oneOf: OrArray<EntityReference>;
  anyOf: OrArray<EntityReference>;
  closed: EntityReference | Date | boolean;
};

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > An Activity is a subtype of Object that describes some form of action that
 * > may happen, is currently happening, or has already happened. The Activity
 * > type itself serves as an abstract base type for all types of activities.
 * > It is important to note that the Activity type itself does not carry any
 * > specific semantics about the kind of action being taken.
 *
 * @see https://www.w3.org/TR/activitystreams-core/#activities
 *
 * @extends CoreObject
 *
 * @instance Accept
 * @instance TentativeAccept
 * @instance Add
 * @instance Arrive
 * @instance Create
 * @instance Delete
 * @instance Follow
 * @instance Ignore
 * @instance Join
 * @instance Leave
 * @instance Like
 * @instance Offer
 * @instance Invite
 * @instance Reject
 * @instance TentativeReject
 * @instance Remove
 * @instance Undo
 * @instance Update
 * @instance View
 * @instance Listen
 * @instance Read
 * @instance Move
 * @instance Travel
 * @instance Announce
 * @instance Block
 * @instance Flag
 * @instance Dislike
 * @instance Question
 */
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

/**
 * Either an Activity or a URL reference to an Activity.
 */
export type ActivityReference = URL | Activity;
