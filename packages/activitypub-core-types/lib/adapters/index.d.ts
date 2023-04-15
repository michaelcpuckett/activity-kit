/// <reference types="node" />
import { AP } from '..';
import { AuthAdapter } from './Auth';
import { CryptoAdapter } from './Crypto';
import { DbAdapter } from './Db';
import { StorageAdapter } from './Storage';
import { FetchPolyfill } from './FetchPolyfill';
export { AuthAdapter } from './Auth';
export { DbAdapter, DbOptions } from './Db';
export { StorageAdapter } from './Storage';
export { CryptoAdapter } from './Crypto';
export { Plugin } from './Plugin';
export { Routes } from './Routes';
export { FetchPolyfill } from './FetchPolyfill';
export type Adapters = {
    auth: AuthAdapter;
    db: DbAdapter;
    storage: StorageAdapter;
    crypto: CryptoAdapter;
};
export type Library = AuthAdapter & DbAdapter & StorageAdapter & CryptoAdapter & {
    fetch: FetchPolyfill;
    getGuid: () => Promise<string>;
    findEntityById: (this: Library, id: URL) => Promise<AP.Entity | null>;
    getActorByUserId: (this: Library, userId: string) => Promise<AP.Actor | null>;
    getPrivateKey: (this: Library, actor: AP.Actor) => Promise<string>;
    getStreamByName: (this: Library, actor: AP.Actor, name: string) => Promise<AP.EitherCollection | null>;
    fetchEntityById: (this: Library, id: URL) => Promise<AP.Entity | null>;
    queryById: (this: Library, id: URL) => Promise<AP.Entity | null>;
    expandEntity: (this: Library, originalEntity: AP.Entity) => Promise<AP.Entity>;
    getCollectionItems: (this: Library, entity: AP.Collection | AP.OrderedCollection) => Promise<AP.EntityReference[]>;
    getPaginatedCollectionItems: (this: Library, collection: AP.Collection | AP.OrderedCollection) => Promise<AP.EntityReference[]>;
    expandCollection: (this: Library, collection: AP.EitherCollectionReference) => Promise<null | AP.EitherCollection>;
    getRecipientInboxUrls: (this: Library, activity: AP.Activity, actor: AP.Actor, inboxesOnly?: boolean) => Promise<URL[]>;
    getRecipientUrls: (this: Library, activity: AP.Activity) => Promise<URL[]>;
    broadcast: (this: Library, activity: AP.Activity, actor: AP.Actor) => Promise<unknown>;
    signAndSendToForeignActorInbox: (this: Library, foreignActorInbox: URL, actor: AP.Actor, activity: AP.Activity) => Promise<unknown>;
};
