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
 * @note All properties come from the ActivityPub spec.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#actors
 * @see https://www.w3.org/TR/activitypub/#actors
 */
export type ActorProperties = {
  // Activity Pub properties.
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
 * @extends CoreObjectProperties
 * @extends ActorProperties
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
 * @extends BaseActor
 */
export type Application = BaseActor<typeof ActorTypes.APPLICATION>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents an individual person.
 *
 * @extends BaseActor
 */
export type Person = BaseActor<typeof ActorTypes.PERSON>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents a formal or informal collective of Actors.
 *
 * @extends BaseActor
 */
export type Group = BaseActor<typeof ActorTypes.GROUP>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents a service of any kind.
 *
 * @extends BaseActor
 */
export type Service = BaseActor<typeof ActorTypes.SERVICE>;

/**
 * Per the ActivityStreams spec:
 *
 * > Represents an organization.
 *
 * @extends BaseActor
 */
export type Organization = BaseActor<typeof ActorTypes.ORGANIZATION>;

/**
 * Per the ActivityStreams Vocabulary spec:
 *
 * > An Entity that either performed or is expected to perform an Activity.
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-actor
 *
 * @extends BaseEntity
 * @extends BaseExtendedObject
 * @extends BaseActor
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
