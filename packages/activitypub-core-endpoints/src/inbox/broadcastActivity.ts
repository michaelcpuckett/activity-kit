import { InboxEndpoint } from '.';

export async function broadcastActivity(this: InboxEndpoint) {
  if (!this.activity) {
    throw new Error('No activity.');
  }

  if (!this.actor) {
    throw new Error('No actor.');
  }

  if (await this.shouldForwardActivity()) {
    await this.deliveryService.broadcast(this.activity, this.actor);
  }
}