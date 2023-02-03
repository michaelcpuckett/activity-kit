import { AP, assertExists, assertIsApActivity, assertIsApActor } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '.';

export async function savePeer(this: InboxPostEndpoint) {
  try {
    assertIsApActivity(this.activity);

    const actorId = getId(this.activity.actor);

    const actor = await this.adapters.db.fetchEntityById(actorId);

    assertIsApActor(actor);

    const sharedInboxUrl = actor.endpoints?.sharedInbox;

    assertExists(sharedInboxUrl);

    await this.adapters.db.saveString('peer', sharedInboxUrl.hostname, sharedInboxUrl.toString());
  } catch (error) {
    console.log(error);
  }
} 