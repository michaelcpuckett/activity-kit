import * as AP from '../activitypub';
import { DbAdapter } from './Db';
import { FetchPolyfill } from './FetchPolyfill';

export type DeliveryAdapter = {
  adapters: {
    db: DbAdapter;
    fetch?: FetchPolyfill;
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
  ) => Promise<URL[]>;
  getRecipientsList: (
    this: DeliveryAdapter,
    to: AP.EntityReference | AP.EntityReference[],
  ) => Promise<URL[]>;
  isPublic: (this: DeliveryAdapter, activity: AP.Activity) => boolean;
  getPeerInboxUrls: (this: DeliveryAdapter) => Promise<Array<URL>>;
};
