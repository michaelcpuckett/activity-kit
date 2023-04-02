import { AuthAdapter } from './Auth';
import { CryptoAdapter } from './Crypto';
import { DbAdapter } from './Db';
import { DeliveryAdapter } from './Delivery';
import { StorageAdapter } from './Storage';

export { AuthAdapter } from './Auth';
export { DbAdapter, DbOptions } from './Db';
export { DeliveryAdapter } from './Delivery';
export { StorageAdapter } from './Storage';
export { CryptoAdapter } from './Crypto';

export { Plugin } from './Plugin';
export { Routes } from './Routes';
export { FetchPolyfill } from './FetchPolyfill';

export type Adapters = {
  auth: AuthAdapter;
  db: DbAdapter;
  delivery: DeliveryAdapter;
  storage: StorageAdapter;
  crypto: CryptoAdapter;
};
