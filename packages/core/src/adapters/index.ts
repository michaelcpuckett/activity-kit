import * as AP from '@activity-kit/types';

import { AuthAdapter } from './Auth';
import { CryptoAdapter } from './Crypto';
import { DbAdapter } from './Db';
import { StorageAdapter } from './Storage';
import { FetchPolyfill } from './FetchPolyfill';

export { AuthAdapter } from './Auth';
export { DbAdapter, DbOptions } from './Db';
export { StorageAdapter } from './Storage';
export { CryptoAdapter } from './Crypto';

export { Plugin } from './Plugin';
export { Routes } from './Routes';
export { FetchPolyfill } from './FetchPolyfill';

export type Adapters = {
  auth: AuthAdapter;
  db: DbAdapter;
  storage: StorageAdapter;
  crypto: CryptoAdapter;
};

export type CoreLibrary = AuthAdapter &
  DbAdapter &
  StorageAdapter &
  CryptoAdapter & {
    fetch: FetchPolyfill;
    getGuid: () => Promise<string>;
    findEntityById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    getActorByUserId: (
      this: CoreLibrary,
      userId: string,
    ) => Promise<AP.Actor | null>;
    getStreamByName: (
      this: CoreLibrary,
      actor: AP.Actor,
      name: string,
    ) => Promise<AP.EitherCollection | null>;
    fetchEntityById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    queryById: (this: CoreLibrary, id: URL) => Promise<AP.Entity | null>;
    expandEntity: (this: CoreLibrary, entity: AP.Entity) => Promise<AP.Entity>;
    getPaginatedCollectionItems: (
      this: CoreLibrary,
      collection: AP.Collection | AP.OrderedCollection,
    ) => Promise<AP.EntityReference[]>;
    expandCollection: (
      this: CoreLibrary,
      collection: AP.EitherCollection,
    ) => Promise<AP.EitherCollection>;
    getRecipientUrls: (
      this: CoreLibrary,
      activity: AP.Activity,
    ) => Promise<URL[]>;
    broadcast: (
      this: CoreLibrary,
      activity: AP.Activity,
      actor: AP.Actor,
    ) => Promise<unknown>;
  };
