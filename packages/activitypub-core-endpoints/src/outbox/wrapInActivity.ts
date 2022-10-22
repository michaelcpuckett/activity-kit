import { OutboxPostHandler } from '.';
import {
  LOCAL_DOMAIN,
  combineAddresses,
  getGuid,
  ACTIVITYSTREAMS_CONTEXT,
} from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export async function wrapInActivity() {
  this.activity = combineAddresses({
    type: AP.ActivityTypes.CREATE,
    actor: this.actor.id,
    object: this.activity,
  });

  const activityId = new URL(`${LOCAL_DOMAIN}/activity/${getGuid()}`);
  this.activity.id = activityId; // Overwrite ID
  this.activity.url = activityId;

  await this.handleCreate();
}
