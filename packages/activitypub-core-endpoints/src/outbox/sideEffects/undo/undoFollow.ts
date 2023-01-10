import { getId } from 'activitypub-core-utilities';
import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApType,
} from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoFollow(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Follow>(activity, AP.ActivityTypes.FOLLOW);

  const actorId = getId(activity.actor);
  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const followingId = getId(actor.following);

  assertExists(followingId);

  const objectId = getId(activity.object);
  const object = await this.adapters.db.queryById(objectId);

  assertIsApActor(object);

  await this.adapters.db.removeItem(followingId, objectId);
}
