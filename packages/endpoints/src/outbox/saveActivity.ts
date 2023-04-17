import { OutboxPostEndpoint } from '.';
import { assertExists, assertIsApActivity } from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';

export async function saveActivity(this: OutboxPostEndpoint) {
  assertIsApActivity(this.activity);

  const publishedDate = new Date();
  this.activity.published = publishedDate;

  const activityId = getId(this.activity);

  assertExists(activityId);

  const actorId = getId(this.activity.actor);

  assertExists(actorId);

  const outboxId = getId(this.actor.outbox);

  assertExists(outboxId);

  await Promise.all([
    this.core.saveEntity(this.activity),
    this.core.insertOrderedItem(outboxId, activityId),
  ]);
}
