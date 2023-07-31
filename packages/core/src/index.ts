import * as AP from '@activity-kit/types';
import fetch from 'isomorphic-fetch';

import {
  AuthAdapter,
  CryptoAdapter,
  DbAdapter,
  DbOptions,
  FetchPolyfill,
  StorageAdapter,
  CoreLibrary,
} from './adapters';

import { findEntityById } from './findEntityById';
import { fetchEntityById } from './fetchEntityById';
import { queryById } from './queryById';
import { expandEntity } from './expandEntity';
import { getPaginatedCollectionItems } from './getPaginatedCollectionItems';
import { expandCollection } from './expandCollection';
import { getActorByUserId } from './getActorByUserId';
import { getStreamByName } from './getStreamByName';
import { broadcast } from './broadcast';
import { getRecipientUrls } from './getRecipientUrls';

export class Core implements CoreLibrary {
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
    this.fetch = adapters.fetch ?? fetch;

    if (adapters.db.initializeDb) {
      this.initializeDb = async () => await adapters.db.initializeDb?.();
    }

    this.findAll = async (
      collection: string,
      matchingObject: Record<string, unknown>,
    ) => await adapters.db.findAll(collection, matchingObject);

    this.findOne = async (
      collection: string,
      matchingObject: Record<string, unknown>,
      options?: Array<keyof typeof DbOptions>,
    ) => await adapters.db.findOne(collection, matchingObject, options);

    this.findStringIdByValue = async (dbCollection: string, value: string) =>
      await adapters.db.findStringIdByValue(dbCollection, value);

    this.findStringValueById = async (dbCollection: string, _id: string) =>
      await adapters.db.findStringValueById(dbCollection, _id);

    this.insertItem = async (path: URL, url: URL) =>
      await adapters.db.insertItem(path, url);

    this.removeItem = async (path: URL, url: URL) =>
      await adapters.db.removeItem(path, url);

    this.insertOrderedItem = async (path: URL, url: URL) =>
      await adapters.db.insertOrderedItem(path, url);

    this.removeOrderedItem = async (path: URL, url: URL) =>
      await adapters.db.removeOrderedItem(path, url);

    this.saveEntity = async (entity: AP.Entity) =>
      await adapters.db.saveEntity(entity);

    this.saveString = async (
      dbCollection: string,
      _id: string,
      value: string,
    ) => await adapters.db.saveString(dbCollection, _id, value);

    this.getHttpSignature = async (
      foreignTarget: URL,
      actorId: URL,
      privateKey: string,
      entity?: Record<string, unknown>,
    ) =>
      await adapters.crypto.getHttpSignature(
        foreignTarget,
        actorId,
        privateKey,
        entity,
      );

    this.generateKeyPair = async () => await adapters.crypto.generateKeyPair();

    this.hashPassword = async (password: string, salt: string) =>
      await adapters.crypto.hashPassword(password, salt);

    this.randomBytes = async (numberOfBytes: number) =>
      await adapters.crypto.randomBytes(numberOfBytes);

    this.getGuid = async () => await adapters.crypto.randomBytes(16);

    this.getTokenByUserId = async (userId) =>
      await adapters.auth.getTokenByUserId(userId);

    this.createUser = async ({
      email,
      password,
      preferredUsername,
    }: {
      email: string;
      password?: string;
      preferredUsername: string;
    }) =>
      await adapters.auth.createUser({
        email,
        password,
        preferredUsername,
      });

    this.getUserIdByToken = async (token) =>
      await adapters.auth.getUserIdByToken(token);

    this.authenticatePassword = async (email: string, password: string) =>
      await adapters.auth.authenticatePassword(email, password);

    this.upload = async (file) => await adapters.storage.upload(file);
  }

  // Find.

  public findEntityById = findEntityById;
  public getActorByUserId = getActorByUserId;
  public getStreamByName = getStreamByName;

  // Fetch.

  public fetchEntityById = fetchEntityById;
  public queryById = queryById;

  // Expand.

  public expandEntity = expandEntity;
  public getPaginatedCollectionItems = getPaginatedCollectionItems;
  public expandCollection = expandCollection;

  // Broadcast Server-to-Server.

  public broadcast = broadcast;
  public getRecipientUrls = getRecipientUrls;
}

export {
  AuthAdapter,
  CryptoAdapter,
  DbAdapter,
  DbOptions,
  FetchPolyfill,
  StorageAdapter,
  CoreLibrary,
  Plugin,
  Routes,
} from './adapters';
