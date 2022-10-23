import type { IncomingMessage, ServerResponse } from 'http';
import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';
import { InboxEndpoint } from '../inbox';
import { saveActivity } from './saveActivity';
import { getRecipientInboxIds } from './getRecipientInboxIds';

export async function sharedInboxHandler(
  req: IncomingMessage,
  res: ServerResponse,
  databaseService: Database,
  deliveryService: DeliveryService,
) {
  if (req.method === 'POST') {
    return await new SharedInboxEndpoint(req, res, databaseService, deliveryService).handlePost();
  }
}

export class SharedInboxEndpoint extends InboxEndpoint {
  protected getRecipientInboxIds = getRecipientInboxIds;
  protected override saveActivity = saveActivity;
}