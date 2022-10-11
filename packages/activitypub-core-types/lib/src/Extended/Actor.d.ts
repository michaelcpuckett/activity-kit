/// <reference types="node" />
import { BaseCoreObject } from '../Core/CoreObject';
import { ActorTypes } from '../util/const';
import { CollectionReference, EitherCollectionReference, OrderedCollectionReference } from './Collection';
import { StringReferenceMap } from '../util/values';
declare type BaseActor = BaseCoreObject & {
    type: typeof ActorTypes[keyof typeof ActorTypes];
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
export declare type Application = BaseActor & {
    type: typeof ActorTypes.APPLICATION;
};
export declare type Person = BaseActor & {
    type: typeof ActorTypes.PERSON;
};
export declare type Group = BaseActor & {
    type: typeof ActorTypes.GROUP;
};
export declare type Service = BaseActor & {
    type: typeof ActorTypes.SERVICE;
};
export declare type Organization = BaseActor & {
    type: typeof ActorTypes.ORGANIZATION;
};
export declare type Actor = Application | Service | Group | Organization | Person;
export declare type ActorReference = URL | Actor;
export {};
