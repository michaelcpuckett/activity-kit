import * as AP from '@activity-kit/types';
import { assertIsApActor, isTypeOf } from '@activity-kit/type-utilities';
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
    if (isTypeOf<AP.Activity>(this.activity, AP.ActivityTypes)) {
      await this.core.broadcast(this.activity, botActor);
    }
  }
}
