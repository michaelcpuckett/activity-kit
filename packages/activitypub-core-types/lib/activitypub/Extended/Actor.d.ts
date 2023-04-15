import { BaseCoreObject } from '../Core/CoreObject';
import { ActorTypes } from '../util/const';
import { CollectionReference, EitherCollectionReference, OrderedCollectionReference } from './Collection';
import { StringReferenceMap } from '../util/values';
import { TypeOrArrayWithType } from '../Core/Entity';
type BaseActor = BaseCoreObject & {
    type: TypeOrArrayWithType<typeof ActorTypes[keyof typeof ActorTypes]>;
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
export type Application = BaseActor & {
    type: TypeOrArrayWithType<typeof ActorTypes.APPLICATION>;
};
export type Person = BaseActor & {
    type: TypeOrArrayWithType<typeof ActorTypes.PERSON>;
};
export type Group = BaseActor & {
    type: TypeOrArrayWithType<typeof ActorTypes.GROUP>;
};
export type Service = BaseActor & {
    type: TypeOrArrayWithType<typeof ActorTypes.SERVICE>;
};
export type Organization = BaseActor & {
    type: TypeOrArrayWithType<typeof ActorTypes.ORGANIZATION>;
};
export type Actor = Application | Service | Group | Organization | Person;
export type ActorReference = URL | Actor;
export {};
