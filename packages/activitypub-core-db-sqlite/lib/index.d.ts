import { Database } from 'sqlite';
import { initializeDb } from './initializeDb';
import { findOne } from './findOne';
import { findStringValueById } from './findStringValueById';
import { findStringIdByValue } from './findStringIdByValue';
import { saveEntity } from './saveEntity';
import { saveString } from './saveString';
import { insertItem, removeOrderedItem, insertOrderedItem, removeItem } from './insert';
import { findAll } from './findAll';
import type { DbAdapter, FetchPolyfill } from 'activitypub-core-types';
export declare class SqliteDbAdapter implements DbAdapter {
    db: Database;
    fetch: FetchPolyfill;
    constructor(db: Database, adapters?: {
        fetch?: FetchPolyfill;
    });
    initializeDb: typeof initializeDb;
    findOne: typeof findOne;
    findAll: typeof findAll;
    findStringValueById: typeof findStringValueById;
    findStringIdByValue: typeof findStringIdByValue;
    saveEntity: typeof saveEntity;
    saveString: typeof saveString;
    insertItem: typeof insertItem;
    removeItem: typeof removeItem;
    insertOrderedItem: typeof insertOrderedItem;
    removeOrderedItem: typeof removeOrderedItem;
}
