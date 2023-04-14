import * as AP from '../activitypub';
import { CryptoAdapter } from './Crypto';
import { FetchPolyfill } from './FetchPolyfill';

export const DbOptions = {
  CASE_INSENSITIVE: 'CASE_INSENSITIVE',
} as const;

// TODO Strip out functions from Db Adapter that don't need direct DB access
export type DbAdapter = {
  db: unknown;
  adapters: {
    crypto: CryptoAdapter;
    fetch?: FetchPolyfill;
  };

  initializeDb?: (this: DbAdapter) => Promise<void>;
  expandCollection: (
    this: DbAdapter,
    collection: AP.EitherCollectionReference,
  ) => Promise<null | AP.EitherCollection>;
  expandEntity: (
    this: DbAdapter,
    originalEntity: AP.Entity,
  ) => Promise<AP.Entity>;
  getPrivateKey: (this: DbAdapter, actor: AP.Actor) => Promise<string>;
  fetchEntityById: (this: DbAdapter, id: URL) => Promise<AP.Entity | null>;
  findAll: (
    this: DbAdapter,
    collection: string,
    matchingObject: { [key: string]: unknown },
  ) => Promise<AP.Entity[] | null>;
  findEntityById: (this: DbAdapter, id: URL) => Promise<AP.Entity | null>;
  findOne: (
    this: DbAdapter,
    collection: string,
    matchingObject: { [key: string]: unknown },
    options?: Array<keyof typeof DbOptions>,
  ) => Promise<AP.Entity | null>;
  findStringIdByValue: (
    this: DbAdapter,
    dbCollection: string,
    value: string,
  ) => Promise<string>;
  findStringValueById: (
    this: DbAdapter,
    dbCollection: string,
    _id: string,
  ) => Promise<string>;
  getActorByUserId: (
    this: DbAdapter,
    userId: string,
  ) => Promise<AP.Actor | null>;
  getStreamByName: (
    this: DbAdapter,
    actor: AP.Actor,
    name: string,
  ) => Promise<AP.Collection | AP.OrderedCollection | null>;
  getCollectionItems: (
    this: DbAdapter,
    entity: AP.Collection | AP.OrderedCollection,
  ) => Promise<AP.EntityReference[]>;
  getPaginatedCollectionItems: (
    this: DbAdapter,
    collection: AP.Collection | AP.OrderedCollection,
  ) => Promise<AP.EntityReference[]>;
  insertItem: (this: DbAdapter, path: URL, url: URL) => Promise<void>;
  removeItem: (this: DbAdapter, path: URL, url: URL) => Promise<void>;
  insertOrderedItem: (this: DbAdapter, path: URL, url: URL) => Promise<void>;
  removeOrderedItem: (this: DbAdapter, path: URL, url: URL) => Promise<void>;
  queryById: (this: DbAdapter, id: URL) => Promise<AP.Entity | null>;
  saveEntity: (this: DbAdapter, entity: AP.Entity) => Promise<void>;
  saveString: (
    this: DbAdapter,
    dbCollection: string,
    _id: string,
    value: string,
  ) => Promise<void>;
};
