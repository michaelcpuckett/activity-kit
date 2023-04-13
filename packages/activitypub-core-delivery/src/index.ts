import type {
  CryptoAdapter,
  DbAdapter,
  FetchPolyfill,
} from 'activitypub-core-types';
import { broadcast } from './broadcast';
import { getRecipientUrls } from './getRecipientUrls';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
import fetch from 'isomorphic-fetch';

export class DeliveryAdapter {
  adapters: {
    db: DbAdapter;
    crypto: CryptoAdapter;
    fetch: FetchPolyfill;
  };

  constructor(config: {
    adapters: {
      db: DbAdapter;
      crypto: CryptoAdapter;
      fetch?: FetchPolyfill;
    };
  }) {
    this.adapters = {
      ...config.adapters,
      fetch: config.adapters.fetch ?? fetch,
    };
  }

  public signAndSendToForeignActorInbox = signAndSendToForeignActorInbox;
  public broadcast = broadcast;
  public getRecipientInboxUrls = getRecipientInboxUrls;
  public getRecipientUrls = getRecipientUrls;
}
