import { AuthAdapter } from './Auth';
import { DbAdapter } from './Db';
import { DeliveryAdapter } from './Delivery';
import { StorageAdapter } from './Storage';

export { AuthAdapter } from './Auth';
export { DbAdapter, DbOptions } from './Db';
export { DeliveryAdapter } from './Delivery';
export { StorageAdapter } from './Storage';

export { Plugin } from './Plugin';
export { FetchPolyfill } from './FetchPolyfill';

export type Adapters = {
  auth: AuthAdapter;
  db: DbAdapter;
  delivery: DeliveryAdapter;
  storage: StorageAdapter;
};
