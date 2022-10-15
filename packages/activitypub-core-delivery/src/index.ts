import type { Database } from 'activitypub-core-types';
import { broadcast } from './broadcast';
import { getPrivateKey } from './getPrivateKey';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { getRecipientsList } from './getRecipientsList';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
import fetch from 'isomorphic-fetch';

export class DeliveryService {
  databaseService: Database;
  fetch: Function;

  constructor(databaseService: Database, fetchFn?: Function) {
    this.databaseService = databaseService;
    this.fetch = fetchFn ?? fetch;
  }

  public getPrivateKey = getPrivateKey;
  public signAndSendToForeignActorInbox = signAndSendToForeignActorInbox;
  public broadcast = broadcast;
  public getRecipientInboxUrls = getRecipientInboxUrls;
  public getRecipientsList = getRecipientsList;
}
