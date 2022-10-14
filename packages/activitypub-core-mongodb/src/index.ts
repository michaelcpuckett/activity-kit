import { DB_NAME, MONGO_CLIENT_URL } from 'activitypub-core-utilities';
import fetch from 'isomorphic-fetch';
import { Db, MongoClient } from 'mongodb';

import { findOne } from './findOne';
import { findEntityById } from './findEntityById';
import { findStringValueById } from './findStringValueById';
import { findStringIdByValue } from './findStringIdByValue';
import { saveEntity } from './saveEntity';
import { saveString } from './saveString';
import {
  insertItem,
  removeOrderedItem,
  insertOrderedItem,
  removeItem,
} from './insert';
import { fetchEntityById } from './fetchEntityById';
import { queryById } from './queryById';
import { expandEntity } from './expandEntity';
import { getCollectionItems } from './getCollectionItems';
import { expandCollection } from './expandCollection';
import { findAll } from './findAll';
import { getAuthenticatedUserIdByToken } from './getAuthenticatedUserIdByToken';
import { getActorByToken } from './getActorByToken';
import type { Database, DatabaseService } from 'activitypub-core-types/index';

export class MongoDatabase implements Database {
  db: Db;
  fetch: Function;

  constructor(db: Db, fetchFn?: Function) {
    this.db = db;
    this.fetch = fetchFn ?? fetch;
  }

  // Find.

  public findOne = findOne;
  public findAll = findAll;
  public findEntityById = findEntityById;
  public findStringValueById = findStringValueById;
  public findStringIdByValue = findStringIdByValue;

  // Auth.

  public getAuthenticatedUserIdByToken = getAuthenticatedUserIdByToken;
  public getActorByToken = getActorByToken;

  // Save.

  public saveEntity = saveEntity;
  public saveString = saveString;

  // Insert/Remove

  public insertItem = insertItem;
  public removeItem = removeItem;
  public insertOrderedItem = insertOrderedItem;
  public removeOrderedItem = removeOrderedItem;

  // Fetch.

  public fetchEntityById = fetchEntityById;
  public queryById = queryById;

  // Expand

  public expandEntity = expandEntity;
  public getCollectionItems = getCollectionItems;
  public expandCollection = expandCollection;
};

export class MongoDatabaseService implements DatabaseService {
  async connect() {
    const client = new MongoClient(MONGO_CLIENT_URL, {
      minPoolSize: 10,
    });
    await client.connect();
    const db = client.db(DB_NAME);
    return new MongoDatabase(db, fetch);
  }
}