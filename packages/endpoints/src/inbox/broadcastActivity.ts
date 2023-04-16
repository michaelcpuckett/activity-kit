import { AP, assertIsApActor } from '@activity-kit/types';
import { SERVER_ACTOR_USERNAME } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

export async function broadcastActivity(this: InboxPostEndpoint) {
  if (!this.activity) {
    throw new Error('No activity.');
  }

  const botActor = await this.core.findOne('entity', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  });

  assertIsApActor(botActor);

  if (await this.shouldForwardActivity()) {
    await this.core.broadcast(this.activity as AP.Activity, botActor);
  }
}
