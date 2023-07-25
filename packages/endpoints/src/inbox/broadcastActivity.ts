import { assert } from '@activity-kit/type-utilities';
import { SERVER_ACTOR_USERNAME } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

export async function broadcastActivity(this: InboxPostEndpoint) {
  assert.isApActivity(this.activity);

  const botActor = await this.core.findOne('entity', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  });

  assert.isApActor(botActor);

  if (await this.shouldForwardActivity()) {
    await this.core.broadcast(this.activity, botActor);
  }
}
