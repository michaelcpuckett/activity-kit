import { DatabaseService } from '../DatabaseService';
import { broadcast } from './broadcast';
import { getPrivateKey } from './getPrivateKey';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { getRecipientsList } from './getRecipientsList';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';

export class DeliveryService {
  databaseService: DatabaseService;

  constructor(databaseService: DatabaseService, fetch?: unknown) {
    this.databaseService = databaseService;
  }

  public getPrivateKey = getPrivateKey;
  public signAndSendToForeignActorInbox = signAndSendToForeignActorInbox;
  public broadcast = broadcast;
  public getRecipientInboxUrls = getRecipientInboxUrls;
  public getRecipientsList = getRecipientsList;
}
