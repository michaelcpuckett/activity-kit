import { AP, assertIsApActor } from 'activitypub-core-types';
import { SERVER_ACTOR_USERNAME } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '.';

export async function broadcastActivity(this: InboxPostEndpoint) {
  if (!this.activity) {
    throw new Error('No activity.');
  }

  const botActor = await this.layers.data.findOne('entity', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  });

  assertIsApActor(botActor);

  if (await this.shouldForwardActivity()) {
    await this.layers.data.broadcast(this.activity as AP.Activity, botActor);
  }
}
