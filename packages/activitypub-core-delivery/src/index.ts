import type { DbAdapter } from 'activitypub-core-types';
import { broadcast } from './broadcast';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { getRecipientsList } from './getRecipientsList';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
import fetch from 'isomorphic-fetch';

export class DeliveryAdapter {
  adapters: {
    db: DbAdapter;
    fetch: Function;
  };

  constructor(config: {
    adapters: {
      db: DbAdapter;
      fetch?: Function;
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
  public getRecipientsList = getRecipientsList;
}
