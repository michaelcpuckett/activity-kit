import { AP } from "activitypub-core-types";
import { InboxPostEndpoint } from ".";

export async function broadcastActivity(this: InboxPostEndpoint) {
  if (!this.activity) {
    throw new Error('No activity.');
  }

  if (!this.actor) {
    throw new Error('No actor.');
  }

  if (await this.shouldForwardActivity()) {
    await this.adapters.delivery.broadcast(this.activity as AP.Activity, this.actor);
  }
}