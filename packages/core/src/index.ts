import fetch from 'isomorphic-fetch';

import {
  AuthAdapter,
  CryptoAdapter,
  DbAdapter,
  FetchPolyfill,
  StorageAdapter,
} from './adapters';

import { findEntityById } from './findEntityById';
import { queryById } from './queryById';
import { expandEntity } from './expandEntity';
import { getPaginatedCollectionItems } from './getPaginatedCollectionItems';
import { expandCollection } from './expandCollection';
import { getActorByUserId } from './getActorByUserId';
import { getStreamByName } from './getStreamByName';
import { broadcast } from './broadcast';
import { getRecipientUrls } from './getRecipientUrls';

class CoreFunctions {
  // Find.
  public findEntityById = findEntityById;
  public queryById = queryById;
  public getActorByUserId = getActorByUserId;
  public getStreamByName = getStreamByName;

  // Expand.
  public expandEntity = expandEntity;
  public getPaginatedCollectionItems = getPaginatedCollectionItems;
  public expandCollection = expandCollection;

  // Server-to-Server.
  public broadcast = broadcast;
  public getRecipientUrls = getRecipientUrls;
}

export class CoreLibrary
  extends CoreFunctions
  implements AuthAdapter, DbAdapter, StorageAdapter, CryptoAdapter
{
  fetch: FetchPolyfill;

  initializeDb?: DbAdapter['initializeDb'];
  findAll: DbAdapter['findAll'];
  findOne: DbAdapter['findOne'];
  findStringIdByValue: DbAdapter['findStringIdByValue'];
  findStringValueById: DbAdapter['findStringValueById'];
  insertItem: DbAdapter['insertItem'];
  removeItem: DbAdapter['removeItem'];
  insertOrderedItem: DbAdapter['insertOrderedItem'];
  removeOrderedItem: DbAdapter['removeOrderedItem'];
  saveEntity: DbAdapter['saveEntity'];
  saveString: DbAdapter['saveString'];

  getTokenByUserId: AuthAdapter['getTokenByUserId'];
  createUser: AuthAdapter['createUser'];
  getUserIdByToken: AuthAdapter['getUserIdByToken'];
  authenticatePassword: AuthAdapter['authenticatePassword'];

  generateKeyPair: CryptoAdapter['generateKeyPair'];
  getHttpSignature: CryptoAdapter['getHttpSignature'];
  hashPassword: CryptoAdapter['hashPassword'];
  randomBytes: CryptoAdapter['randomBytes'];

  upload: StorageAdapter['upload'];

  getGuid: () => Promise<string>;

  constructor(adapters: {
    auth: AuthAdapter;
    storage: StorageAdapter;
    crypto: CryptoAdapter;
    db: DbAdapter;
    fetch?: FetchPolyfill;
  }) {
    super();

    this.fetch = adapters.fetch ?? fetch;

    if (adapters.db.initializeDb) {
      this.initializeDb = adapters.db.initializeDb.bind(adapters.db);
    }

    this.findAll = adapters.db.findAll.bind(adapters.db);

    this.findOne = adapters.db.findOne.bind(adapters.db);

    this.findStringIdByValue = adapters.db.findStringIdByValue.bind(
      adapters.db,
    );

    this.findStringValueById = adapters.db.findStringValueById.bind(
      adapters.db,
    );

    this.insertItem = adapters.db.insertItem.bind(adapters.db);

    this.removeItem = adapters.db.removeItem.bind(adapters.db);

    this.insertOrderedItem = adapters.db.insertOrderedItem.bind(adapters.db);

    this.removeOrderedItem = adapters.db.removeOrderedItem.bind(adapters.db);

    this.saveEntity = adapters.db.saveEntity.bind(adapters.db);

    this.saveString = adapters.db.saveString.bind(adapters.db);

    this.getHttpSignature = adapters.crypto.getHttpSignature.bind(
      adapters.crypto,
    );

    this.generateKeyPair = adapters.crypto.generateKeyPair.bind(
      adapters.crypto,
    );

    this.hashPassword = adapters.crypto.hashPassword.bind(adapters.crypto);

    this.randomBytes = adapters.crypto.randomBytes.bind(adapters.crypto);

    this.getGuid = async () => await adapters.crypto.randomBytes(16);

    this.getTokenByUserId = adapters.auth.getTokenByUserId.bind(adapters.auth);

    this.createUser = adapters.auth.createUser.bind(adapters.auth);

    this.getUserIdByToken = adapters.auth.getUserIdByToken.bind(adapters.auth);

    this.authenticatePassword = adapters.auth.authenticatePassword.bind(
      adapters.auth,
    );

    this.upload = adapters.storage.upload.bind(adapters.storage);
  }
}

export {
  AuthAdapter,
  CryptoAdapter,
  DbAdapter,
  DbOptions,
  FetchPolyfill,
  StorageAdapter,
  Plugin,
  Routes,
} from './adapters';
