import fetch from 'isomorphic-fetch';
import { Database } from 'sqlite';

import { initializeDb } from './initializeDb';
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
import { getPrivateKey } from './getPrivateKey';
import { getCollectionItems } from './getCollectionItems';
import { expandCollection } from './expandCollection';
import { findAll } from './findAll';
import { getActorByUserId } from './getActorByUserId';
import { getStreamByName } from './getStreamByName';
import type { DbAdapter, FetchPolyfill } from 'activitypub-core-types';

export class SqliteDbAdapter implements DbAdapter {
  db: Database;
  fetch: FetchPolyfill;

  constructor(
    db: Database,
    adapters?: {
      fetch?: FetchPolyfill;
    },
  ) {
    this.db = db;
    this.fetch = adapters?.fetch ?? fetch;
  }

  // Initialize.

  public initializeDb = initializeDb;

  // Find.

  public findOne = findOne;
  public findAll = findAll;
  public findEntityById = findEntityById;
  public findStringValueById = findStringValueById;
  public findStringIdByValue = findStringIdByValue;
  public getPrivateKey = getPrivateKey;
  public getStreamByName = getStreamByName;

  // Auth.

  public getActorByUserId = getActorByUserId;

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
}
