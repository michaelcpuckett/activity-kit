import * as AP from '@activity-kit/types';

export const DbOptions = {
  CASE_INSENSITIVE: 'CASE_INSENSITIVE',
  CASE_SENSITIVE: 'CASE_SENSITIVE',
} as const;

export type DbAdapter = {
  db?: unknown;

  initializeDb?: (this: DbAdapter) => Promise<void>;
  findAll: (
    this: DbAdapter,
    collection: string,
    matchingObject: Record<string, unknown>,
  ) => Promise<AP.Entity[] | null>;
  findOne: (
    this: DbAdapter,
    collection: string,
    matchingObject: Record<string, unknown>,
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
  insertItem: (this: DbAdapter, path: URL, url: URL) => Promise<void>;
  removeItem: (this: DbAdapter, path: URL, url: URL) => Promise<void>;
  insertOrderedItem: (this: DbAdapter, path: URL, url: URL) => Promise<void>;
  removeOrderedItem: (this: DbAdapter, path: URL, url: URL) => Promise<void>;
  saveEntity: (this: DbAdapter, entity: AP.Entity) => Promise<void>;
  saveString: (
    this: DbAdapter,
    dbCollection: string,
    _id: string,
    value: string,
  ) => Promise<void>;
};
