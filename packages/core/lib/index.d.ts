/// <reference types="node" />
import * as AP from '@activity-kit/types';
import { AuthAdapter, CryptoAdapter, DbAdapter, FetchPolyfill, StorageAdapter, CoreLibrary } from './adapters';
export declare class Core implements CoreLibrary {
    fetch: FetchPolyfill;
    initializeDb?: DbAdapter['initializeDb'];
    findAll: DbAdapter['findAll'];
    findOne: DbAdapter['findOne'];
    findStringIdByValue: DbAdapter['findStringIdByValue'];
    findStringValueById: DbAdapter['findStringValueById'];
    insertItem: DbAdapter['insertItem'];
    removeItem: DbAdapter['removeItem'];
    insertOrderedItem: DbAdapter['insertOrderedItem'];
    removeOrderedItem: DbAdapter['removeOrderedItem'];
    saveEntity: DbAdapter['saveEntity'];
    saveString: DbAdapter['saveString'];
    getTokenByUserId: AuthAdapter['getTokenByUserId'];
    createUser: AuthAdapter['createUser'];
    getUserIdByToken: AuthAdapter['getUserIdByToken'];
    authenticatePassword: AuthAdapter['authenticatePassword'];
    generateKeyPair: CryptoAdapter['generateKeyPair'];
    getHttpSignature: CryptoAdapter['getHttpSignature'];
    hashPassword: CryptoAdapter['hashPassword'];
    randomBytes: CryptoAdapter['randomBytes'];
    upload: StorageAdapter['upload'];
    getGuid: () => Promise<string>;
    constructor(adapters: {
        auth: AuthAdapter;
        storage: StorageAdapter;
        crypto: CryptoAdapter;
        db: DbAdapter;
        fetch?: FetchPolyfill;
    });
    findEntityById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    getActorByUserId: (this: CoreLibrary, userId: string) => Promise<AP.Actor | null>;
    getPrivateKey: (this: CoreLibrary, actor: AP.Actor) => Promise<string>;
    getStreamByName: (this: CoreLibrary, actor: AP.Actor, name: string) => Promise<AP.EitherCollection | null>;
    fetchEntityById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    queryById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    expandEntity: (this: CoreLibrary, entity: AP.Entity) => Promise<AP.Entity>;
    getCollectionItems: (this: CoreLibrary, entity: AP.Collection | AP.OrderedCollection) => AP.EntityReference[];
    getPaginatedCollectionItems: (this: CoreLibrary, collection: AP.Collection | AP.OrderedCollection) => Promise<AP.EntityReference[]>;
    expandCollection: (this: CoreLibrary, collection: AP.EitherCollection) => Promise<AP.EitherCollection>;
    broadcast: (this: CoreLibrary, activity: AP.Activity, actor: AP.Actor) => Promise<unknown>;
    getRecipientUrls: (this: CoreLibrary, activity: AP.Activity) => Promise<URL[]>;
}
export { AuthAdapter, CryptoAdapter, DbAdapter, DbOptions, FetchPolyfill, StorageAdapter, CoreLibrary, Plugin, Routes, } from './adapters';
