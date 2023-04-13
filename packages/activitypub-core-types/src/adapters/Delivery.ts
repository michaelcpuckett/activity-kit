import * as AP from '../activitypub';
import { CryptoAdapter } from './Crypto';
import { DbAdapter } from './Db';
import { FetchPolyfill } from './FetchPolyfill';

export type DeliveryAdapter = {
  adapters: {
    db: DbAdapter;
    crypto: CryptoAdapter;
    fetch: FetchPolyfill;
  };
  signAndSendToForeignActorInbox: (
    this: DeliveryAdapter,
    foreignActorInbox: URL,
    actor: AP.Actor,
    activity: AP.Activity,
  ) => Promise<unknown>;
  broadcast: (
    this: DeliveryAdapter,
    activity: AP.Activity,
    actor: AP.Actor,
  ) => Promise<unknown>;
  getRecipientInboxUrls: (
    this: DeliveryAdapter,
    activity: AP.Activity,
    actor: AP.Actor,
    inboxesOnly?: boolean,
  ) => Promise<URL[]>;
  getRecipientUrls: (
    this: DeliveryAdapter,
    activity: AP.Activity,
  ) => Promise<URL[]>;
};
