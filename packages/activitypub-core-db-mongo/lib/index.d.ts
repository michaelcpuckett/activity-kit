import { Db } from 'mongodb';
import { findOne } from './findOne';
import { findEntityById } from './findEntityById';
import { findStringValueById } from './findStringValueById';
import { findStringIdByValue } from './findStringIdByValue';
import { saveEntity } from './saveEntity';
import { saveString } from './saveString';
import { insertItem, removeOrderedItem, insertOrderedItem, removeItem } from './insert';
import { fetchEntityById } from './fetchEntityById';
import { queryById } from './queryById';
import { expandEntity } from './expandEntity';
import { getPrivateKey } from './getPrivateKey';
import { getCollectionItems } from './getCollectionItems';
import { expandCollection } from './expandCollection';
import { findAll } from './findAll';
import { getActorByUserId } from './getActorByUserId';
import type { CryptoAdapter, DbAdapter, FetchPolyfill } from 'activitypub-core-types';
export declare class MongoDbAdapter implements DbAdapter {
    db: unknown;
    adapters: {
        crypto: CryptoAdapter;
        fetch?: FetchPolyfill;
    };
    constructor(db: Db, adapters: {
        crypto: CryptoAdapter;
        fetch?: FetchPolyfill;
    });
    findOne: typeof findOne;
    findAll: typeof findAll;
    findEntityById: typeof findEntityById;
    findStringValueById: typeof findStringValueById;
    findStringIdByValue: typeof findStringIdByValue;
    getPrivateKey: typeof getPrivateKey;
    getStreamByName: (this: MongoDbAdapter, actor: import("activitypub-core-types/lib/activitypub").Actor, name: string) => Promise<import("activitypub-core-types/lib/activitypub").Collection | import("activitypub-core-types/lib/activitypub").OrderedCollection>;
    getActorByUserId: typeof getActorByUserId;
    saveEntity: typeof saveEntity;
    saveString: typeof saveString;
    insertItem: typeof insertItem;
    removeItem: typeof removeItem;
    insertOrderedItem: typeof insertOrderedItem;
    removeOrderedItem: typeof removeOrderedItem;
    fetchEntityById: typeof fetchEntityById;
    queryById: typeof queryById;
    expandEntity: typeof expandEntity;
    getCollectionItems: typeof getCollectionItems;
    expandCollection: typeof expandCollection;
}
