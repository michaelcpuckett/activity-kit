import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { SERVER_ACTOR_USERNAME } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

export async function broadcastActivity(this: InboxPostEndpoint) {
  if (!this.activity) {
    throw new Error('No activity.');
  }

  const botActor = await this.core.findOne('entity', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  });

  assert.isApActor(botActor);

  if (await this.shouldForwardActivity()) {
    if (guard.isTypeOf<AP.Activity>(this.activity, AP.ActivityTypes)) {
      await this.core.broadcast(this.activity, botActor);
    }
  }
}
