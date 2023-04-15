import fetch from 'isomorphic-fetch';

import {
  AP,
  CryptoAdapter,
  DbAdapter,
  DbOptions,
  FetchPolyfill,
} from 'activitypub-core-types';

import { findEntityById } from './findEntityById';
import { fetchEntityById } from './fetchEntityById';
import { queryById } from './queryById';
import { expandEntity } from './expandEntity';
import { getPrivateKey } from './getPrivateKey';
import { getCollectionItems } from './getCollectionItems';
import { getPaginatedCollectionItems } from './getPaginatedCollectionItems';
import { expandCollection } from './expandCollection';
import { getActorByUserId } from './getActorByUserId';
import { getStreamByName } from './getStreamByName';
import { broadcast } from './broadcast';
import { getRecipientUrls } from './getRecipientUrls';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';

export class DataLayer {
  fetch: FetchPolyfill;
  initializeDb?: () => Promise<void>;
  findAll: (
    collection: string,
    matchingObject: { [key: string]: unknown },
  ) => Promise<AP.Entity[] | null>;
  findOne: (
    collection: string,
    matchingObject: { [key: string]: unknown },
    options?: Array<keyof typeof DbOptions>,
  ) => Promise<AP.Entity | null>;
  findStringIdByValue: (dbCollection: string, value: string) => Promise<string>;
  findStringValueById: (dbCollection: string, _id: string) => Promise<string>;
  insertItem: (path: URL, url: URL) => Promise<void>;
  removeItem: (path: URL, url: URL) => Promise<void>;
  insertOrderedItem: (path: URL, url: URL) => Promise<void>;
  removeOrderedItem: (path: URL, url: URL) => Promise<void>;
  saveEntity: (entity: AP.Entity) => Promise<void>;
  saveString: (
    dbCollection: string,
    _id: string,
    value: string,
  ) => Promise<void>;
  getGuid: () => Promise<string>;
  getHttpSignature: (
    foreignTarget: URL,
    actorId: URL,
    privateKey: string,
    entity?: AP.Entity,
  ) => Promise<{
    dateHeader: string;
    digestHeader?: string;
    signatureHeader: string;
  }>;

  constructor(adapters: {
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
      matchingObject: { [key: string]: unknown },
    ) => await adapters.db.findAll(collection, matchingObject);

    this.findOne = async (
      collection: string,
      matchingObject: { [key: string]: unknown },
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

    this.getGuid = async () => await adapters.crypto.randomBytes(16);

    this.getHttpSignature = async (
      foreignTarget: URL,
      actorId: URL,
      privateKey: string,
      entity?: AP.Entity,
    ) =>
      await adapters.crypto.getHttpSignature(
        foreignTarget,
        actorId,
        privateKey,
        entity,
      );
  }

  // Find.

  public findEntityById = findEntityById;
  public getActorByUserId = getActorByUserId;
  public getPrivateKey = getPrivateKey;
  public getStreamByName = getStreamByName;

  // Fetch.

  public fetchEntityById = fetchEntityById;
  public queryById = queryById;

  // Expand.

  public expandEntity = expandEntity;
  public getCollectionItems = getCollectionItems;
  public getPaginatedCollectionItems = getPaginatedCollectionItems;
  public expandCollection = expandCollection;

  // Broadcast Server-to-Server.

  public getRecipientInboxUrls = getRecipientInboxUrls;
  public getRecipientUrls = getRecipientUrls;
  public broadcast = broadcast;
  public signAndSendToForeignActorInbox = signAndSendToForeignActorInbox;
}
