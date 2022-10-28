import type { Database } from 'activitypub-core-types';
import { broadcast } from './broadcast';
import { getPrivateKey } from './getPrivateKey';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { getRecipientsList } from './getRecipientsList';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
import fetch from 'isomorphic-fetch';

export class DeliveryAdapter {
  adapters: {
    database: Database;
    fetch: Function;
  };

  constructor(config: {
    adapters: {
      database: Database;
      fetch?: Function;
    }
  }) {
    this.adapters = {
      ...config.adapters,
      fetch: config.adapters.fetch ?? fetch,
    };
  }

  public getPrivateKey = getPrivateKey;
  public signAndSendToForeignActorInbox = signAndSendToForeignActorInbox;
  public broadcast = broadcast;
  public getRecipientInboxUrls = getRecipientInboxUrls;
  public getRecipientsList = getRecipientsList;
}
