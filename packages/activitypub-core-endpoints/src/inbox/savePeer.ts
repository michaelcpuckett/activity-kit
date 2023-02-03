import { AP, assertExists, assertIsApActivity, assertIsApActor } from 'activitypub-core-types';
import { InboxPostEndpoint } from '.';

export async function savePeer(this: InboxPostEndpoint) {
  try {
    assertIsApActivity(this.activity);

    const actor = this.activity.actor;

    assertIsApActor(actor);

    const sharedInboxUrl = actor.endpoints?.sharedInbox;

    assertExists(sharedInboxUrl);

    await this.adapters.db.saveString('peer', sharedInboxUrl.hostname, sharedInboxUrl.toString());
  } catch (error) {
    console.log(error);
  }
} 