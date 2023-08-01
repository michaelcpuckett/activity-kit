import { BaseEntity } from '../Core/Entity';
import { CoreObjectProperties } from '../Core/CoreObject';
import { ActorTypes } from '../util/const';
import {
  CollectionReference,
  EitherCollectionReference,
  OrderedCollectionReference,
} from './Collection';
import { StringReferenceMap } from '../util';

/**
 * A union of all Actor types.
 */
export type AnyActorType = (typeof ActorTypes)[keyof typeof ActorTypes];

/**
 * Properties common to all Actor types.
 *
 * @see https://www.w3.org/TR/activitypub/#actors
 *
 * @note The `manuallyApprovesFollowers` property is not included in the spec,
 * but it is included because it is common to all ActivityPub objects in
 * practice by way of an extension to the spec.
 */
export type ActorProperties = {
  inbox: OrderedCollectionReference;
  outbox: OrderedCollectionReference;
  following?: CollectionReference;
  followers?: CollectionReference;
  liked?: EitherCollectionReference;
  preferredUsername?: string;
  preferredUsernameMap?: StringReferenceMap;
  streams?: EitherCollectionReference[];
  endpoints?: {
    [key: string]: URL | string | undefined;
    proxyUrl?: URL;
    oauthAuthorizationEndpoint?: string;
    oauthTokenEndpoint?: string;
    provideClientKey?: string;
    signClientKey?: string;
    sharedInbox?: URL;
  };
  publicKey?: {
    id: string;
    owner: string;
    publicKeyPem: string;
  };
  manuallyApprovesFollowers?: boolean;
};

/**
 * The base type for all Actor entities.
 *
 * @extends BaseEntity
 *
 * @instance Application
 * @instance Group
 * @instance Organization
 * @instance Person
 * @instance Service
 */
type BaseActor<T extends AnyActorType> = BaseEntity<T> &
  CoreObjectProperties &
  ActorProperties;

/**
 * Per the ActivitySteams spec:
 *
 * > Describes a software application.
 *
 * @type Actor
 */
export type Application = BaseActor<typeof ActorTypes.APPLICATION>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents an individual person.
 *
 * @type Actor
 */
export type Person = BaseActor<typeof ActorTypes.PERSON>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents a formal or informal collective of Actors.
 *
 * @type Actor
 */
export type Group = BaseActor<typeof ActorTypes.GROUP>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents a service of any kind.
 *
 * @type Actor
 */
export type Service = BaseActor<typeof ActorTypes.SERVICE>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents an organization.
 *
 * @type Actor
 */
export type Organization = BaseActor<typeof ActorTypes.ORGANIZATION>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > An Entity that either performed or is expected to perform an Activity.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-actor
 *
 * @extends CoreObject
 *
 * @instance Application
 * @instance Group
 * @instance Organization
 * @instance Person
 * @instance Service
 */
export type Actor = Application | Service | Group | Organization | Person;

/**
 * Either an Actor or a URL reference to an Actor.
 */
export type ActorReference = URL | Actor;
