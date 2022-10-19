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
import { getCollectionItems } from './getCollectionItems';
import { expandCollection } from './expandCollection';
import { findAll } from './findAll';
import { getActorByUserId } from './getActorByUserId';
import type { Database, DatabaseService } from 'activitypub-core-types';
export declare class MongoDatabase implements Database {
    db: Db;
    fetch: Function;
    constructor(db: Db, fetchFn?: Function);
    findOne: typeof findOne;
    findAll: typeof findAll;
    findEntityById: typeof findEntityById;
    findStringValueById: typeof findStringValueById;
    findStringIdByValue: typeof findStringIdByValue;
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
export declare class MongoDatabaseService implements DatabaseService {
    connect({ mongoClientUrl, dbName, }: {
        mongoClientUrl: string;
        dbName?: string;
    }): Promise<MongoDatabase>;
}
