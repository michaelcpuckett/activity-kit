import { AP } from 'activitypub-core-types';
import { InboxPostEndpoint } from '.';

export async function broadcastActivity(this: InboxPostEndpoint) {
  if (!this.activity) {
    throw new Error('No activity.');
  }

  const botActor = (await this.adapters.db.findOne('entity', {
    preferredUsername: 'bot',
  })) as AP.Actor;

  if (!botActor) {
    throw new Error('Bot actor not set up.');
  }

  if (await this.shouldForwardActivity()) {
    await this.adapters.delivery.broadcast(
      this.activity as AP.Activity,
      botActor,
    );
  }
}
