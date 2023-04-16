import { Db } from 'mongodb';
import { DbAdapter } from '@activity-kit/types';
import { findOne } from './findOne';
import { findAll } from './findAll';
import { findStringValueById } from './findStringValueById';
import { findStringIdByValue } from './findStringIdByValue';
import { saveEntity } from './saveEntity';
import { saveString } from './saveString';
import { insertItem, removeOrderedItem, insertOrderedItem, removeItem } from './insert';
export declare class MongoDbAdapter implements DbAdapter {
    db: unknown;
    constructor(db: Db);
    findOne: typeof findOne;
    findAll: typeof findAll;
    findStringValueById: typeof findStringValueById;
    findStringIdByValue: typeof findStringIdByValue;
    saveEntity: typeof saveEntity;
    saveString: typeof saveString;
    insertItem: typeof insertItem;
    insertOrderedItem: typeof insertOrderedItem;
    removeItem: typeof removeItem;
    removeOrderedItem: typeof removeOrderedItem;
}
