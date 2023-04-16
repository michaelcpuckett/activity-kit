import { Database } from 'sqlite';

import type { DbAdapter } from '@activity-kit/types';

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

export class SqliteDbAdapter implements DbAdapter {
  db: Database;

  constructor(db: Database) {
    this.db = db;
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
