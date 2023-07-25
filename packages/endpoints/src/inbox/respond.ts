import { InboxPostEndpoint } from '.';
import { getId } from '@activity-kit/utilities';
import { assert } from '@activity-kit/type-utilities';

export async function respond(this: InboxPostEndpoint) {
  assert.exists(this.activity);

  const activityId = getId(this.activity);

  if (!activityId) {
    throw new Error('Activities without an ID are not supported yet.');
  }

  const existingActivity = await this.core.findEntityById(activityId);

  if (existingActivity) {
    console.log(
      'We have already received this activity. Assuming it was forwarded by another server.',
    );

    return {
      statusCode: 200,
    };
  }

  for (const actor of await this.getActors()) {
    const isBlocked = await this.isBlocked(actor);

    if (isBlocked) {
      console.log('Blocked from appearing in this inbox.');
      continue;
    }

    const actorInboxId = getId(actor.inbox);

    assert.exists(actorInboxId);

    await this.core.insertOrderedItem(actorInboxId, activityId);

    await this.runSideEffects(actor);
  }

  await this.core.saveEntity(this.activity);
  await this.broadcastActivity();

  return {
    statusCode: 200,
  };
}
