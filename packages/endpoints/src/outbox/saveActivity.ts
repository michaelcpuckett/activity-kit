import { OutboxPostEndpoint } from '.';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function saveActivity(this: OutboxPostEndpoint) {
  assert.isApActivity(this.activity);

  const publishedDate = new Date();
  this.activity.published = publishedDate;

  const activityId = getId(this.activity);

  assert.exists(activityId);

  const actorId = getId(this.activity.actor);

  assert.exists(actorId);

  const outboxId = getId(this.actor.outbox);

  assert.exists(outboxId);

  await Promise.all([
    this.core.saveEntity(this.activity),
    this.core.insertOrderedItem(outboxId, activityId),
  ]);
}
