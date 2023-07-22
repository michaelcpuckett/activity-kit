import { BaseEntity } from '../Core/Entity';
import { CoreObjectProperties } from '../Core/CoreObject';
import { ActorTypes } from '../util/const';
import {
  CollectionReference,
  EitherCollectionReference,
  OrderedCollectionReference,
} from './Collection';
import { StringReferenceMap } from '../util';

export type AnyActorType = (typeof ActorTypes)[keyof typeof ActorTypes];

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
 * In ActivityPub, a user is represented by "actors" via the user's accounts
 * on servers. User's accounts on different servers correspond to different actors.
 *
 * Every Actor has:
 * An inbox: How they get messages from the world
 * An outbox: How they send messages to others
 *
 * These are endpoints, or really, just URLs which are listed in the ActivityPub
 * actor's ActivityStreams description.
 */

type BaseActor<T extends AnyActorType> = BaseEntity<T> &
  CoreObjectProperties &
  ActorProperties;

export type Application = BaseActor<typeof ActorTypes.APPLICATION>;

export type Person = BaseActor<typeof ActorTypes.PERSON>;

export type Group = BaseActor<typeof ActorTypes.GROUP>;

export type Service = BaseActor<typeof ActorTypes.SERVICE>;

export type Organization = BaseActor<typeof ActorTypes.ORGANIZATION>;

export type Actor = Application | Service | Group | Organization | Person;
export type ActorReference = URL | Actor;
