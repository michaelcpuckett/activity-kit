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
export type CoreLibrary = AuthAdapter & DbAdapter & StorageAdapter & CryptoAdapter & {
    fetch: FetchPolyfill;
    getGuid: () => Promise<string>;
    findEntityById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    getActorByUserId: (this: CoreLibrary, userId: string) => Promise<AP.Actor | null>;
    getPrivateKey: (this: CoreLibrary, actor: AP.Actor) => Promise<string>;
    getStreamByName: (this: CoreLibrary, actor: AP.Actor, name: string) => Promise<AP.EitherCollection | null>;
    fetchEntityById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    queryById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    expandEntity: (this: CoreLibrary, originalEntity: AP.Entity) => Promise<AP.Entity>;
    getCollectionItems: (this: CoreLibrary, entity: AP.Collection | AP.OrderedCollection) => Promise<AP.EntityReference[]>;
    getPaginatedCollectionItems: (this: CoreLibrary, collection: AP.Collection | AP.OrderedCollection) => Promise<AP.EntityReference[]>;
    expandCollection: (this: CoreLibrary, collection: AP.EitherCollectionReference) => Promise<null | AP.EitherCollection>;
    getRecipientInboxUrls: (this: CoreLibrary, activity: AP.Activity, actor: AP.Actor, inboxesOnly?: boolean) => Promise<URL[]>;
    getRecipientUrls: (this: CoreLibrary, activity: AP.Activity) => Promise<URL[]>;
    broadcast: (this: CoreLibrary, activity: AP.Activity, actor: AP.Actor) => Promise<unknown>;
    signAndSendToForeignActorInbox: (this: CoreLibrary, foreignActorInbox: URL, actor: AP.Actor, activity: AP.Activity) => Promise<unknown>;
};
