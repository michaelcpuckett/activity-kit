import { BaseCoreObject } from '../Core/CoreObject';
import { ActorTypes } from '../util/const';
import {
  CollectionReference,
  EitherCollectionReference,
  OrderedCollectionReference,
} from './Collection';
import { StringReferenceMap } from '../util/values';

// Actors.

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

type BaseActor = BaseCoreObject & {
  // Activity Streams properties.
  type: typeof ActorTypes[keyof typeof ActorTypes];

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
};

export type Application = BaseActor & {
  type: typeof ActorTypes.APPLICATION;
};

export type Person = BaseActor & {
  type: typeof ActorTypes.PERSON;
};

export type Group = BaseActor & {
  type: typeof ActorTypes.GROUP;
};

export type Service = BaseActor & {
  type: typeof ActorTypes.SERVICE;
};

export type Organization = BaseActor & {
  type: typeof ActorTypes.ORGANIZATION;
};

export type Actor = Application | Service | Group | Organization | Person;
export type ActorReference = URL | Actor;
