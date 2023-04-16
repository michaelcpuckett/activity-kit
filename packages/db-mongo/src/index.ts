import { Db } from 'mongodb';

import { DbAdapter } from '@activity-kit/types';

import { findOne } from './findOne';
import { findAll } from './findAll';
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

export class MongoDbAdapter implements DbAdapter {
  db: unknown;

  constructor(db: Db) {
    this.db = db;
  }

  // Find.

  public findOne = findOne;
  public findAll = findAll;
  public findStringValueById = findStringValueById;
  public findStringIdByValue = findStringIdByValue;

  // Save.

  public saveEntity = saveEntity;
  public saveString = saveString;

  // Insert.

  public insertItem = insertItem;
  public insertOrderedItem = insertOrderedItem;

  // Remove.

  public removeItem = removeItem;
  public removeOrderedItem = removeOrderedItem;
}
