import { AP, assertExists, assertIsApActor } from 'activitypub-core-types';
import { InboxPostEndpoint } from '.';

export async function savePeer(this: InboxPostEndpoint, actor: AP.Actor) {
  try {
    assertIsApActor(actor);

    const sharedInboxUrl = actor.endpoints?.sharedInbox;

    assertExists(sharedInboxUrl);

    await this.adapters.db.saveString('peer', sharedInboxUrl.hostname, sharedInboxUrl.toString());
  } catch (error) {
    console.log(error);
  }
} 