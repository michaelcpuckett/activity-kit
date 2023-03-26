import type { DbAdapter, FetchPolyfill } from 'activitypub-core-types';
import { broadcast } from './broadcast';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { getRecipientsList } from './getRecipientsList';
import { isPublic } from './isPublic';
import { getPeerInboxUrls } from './getPeerInboxUrls';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
import fetch from 'isomorphic-fetch';

export class DeliveryAdapter {
  adapters: {
    db: DbAdapter;
    fetch: FetchPolyfill;
  };

  constructor(config: {
    adapters: {
      db: DbAdapter;
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
  public getRecipientsList = getRecipientsList;
  public isPublic = isPublic;
  public getPeerInboxUrls = getPeerInboxUrls;
}
