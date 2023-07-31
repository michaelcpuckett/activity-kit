import { AuthAdapter, CryptoAdapter, DbAdapter, FetchPolyfill, StorageAdapter } from './adapters';
import { findEntityById } from './findEntityById';
import { queryById } from './queryById';
import { expandEntity } from './expandEntity';
import { getPaginatedCollectionItems } from './getPaginatedCollectionItems';
import { expandCollection } from './expandCollection';
import { getActorByUserId } from './getActorByUserId';
import { getStreamByName } from './getStreamByName';
import { broadcast } from './broadcast';
import { getRecipientUrls } from './getRecipientUrls';
declare class CoreFunctions {
    findEntityById: typeof findEntityById;
    queryById: typeof queryById;
    getActorByUserId: typeof getActorByUserId;
    getStreamByName: typeof getStreamByName;
    expandEntity: typeof expandEntity;
    getPaginatedCollectionItems: typeof getPaginatedCollectionItems;
    expandCollection: typeof expandCollection;
    broadcast: typeof broadcast;
    getRecipientUrls: typeof getRecipientUrls;
}
export declare class CoreLibrary extends CoreFunctions implements AuthAdapter, DbAdapter, StorageAdapter, CryptoAdapter {
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
}
export { AuthAdapter, CryptoAdapter, DbAdapter, DbOptions, FetchPolyfill, StorageAdapter, Plugin, Routes, } from './adapters';
