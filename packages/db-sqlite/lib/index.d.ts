import { Database } from 'sqlite';
import type { DbAdapter } from '@activity-kit/types';
import { initializeDb } from './initializeDb';
import { findOne } from './findOne';
import { findStringValueById } from './findStringValueById';
import { findStringIdByValue } from './findStringIdByValue';
import { saveEntity } from './saveEntity';
import { saveString } from './saveString';
import { insertItem, removeOrderedItem, insertOrderedItem, removeItem } from './insert';
import { findAll } from './findAll';
export declare class SqliteDbAdapter implements DbAdapter {
    db: Database;
    constructor(db: Database);
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
