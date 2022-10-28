import { AP } from 'activitypub-core-types';
import { InboxPostEndpoint } from '../inbox';
import { getActor } from './getActor';
import { broadcastActivity } from './broadcastActivity';
import { saveActivity } from './saveActivity';
import { getRecipientInboxIds } from './getRecipientInboxIds';

export class SharedInboxPostEndpoint extends InboxPostEndpoint {
  public getRecipientInboxIds = getRecipientInboxIds; // TODO protected
  protected override getActor = getActor;
  protected override broadcastActivity = broadcastActivity;
  protected override saveActivity = saveActivity;
}