import fetch from 'isomorphic-fetch';
import { Database } from 'sqlite';

import { initializeDb } from './initializeDb';
import { findOne } from './findOne';
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
import { findAll } from './findAll';
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
  public findStringValueById = findStringValueById;
  public findStringIdByValue = findStringIdByValue;

  // Save.

  public saveEntity = saveEntity;
  public saveString = saveString;

  // Insert/Remove

  public insertItem = insertItem;
  public removeItem = removeItem;
  public insertOrderedItem = insertOrderedItem;
  public removeOrderedItem = removeOrderedItem;
}
