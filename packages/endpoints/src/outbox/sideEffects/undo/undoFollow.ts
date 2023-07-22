import { getId } from '@activity-kit/utilities';
import * as AP from '@activity-kit/types';
import {
  assertExists,
  assertIsApActor,
  assertIsApType,
} from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoFollow(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Follow>(activity, AP.ActivityTypes.FOLLOW);

  const actorId = getId(activity.actor);
  const actor = await this.core.queryById(actorId);

  assertIsApActor(actor);

  const followingId = getId(actor.following);

  assertExists(followingId);

  const objectId = getId(activity.object);
  const object = await this.core.queryById(objectId);

  assertIsApActor(object);

  await this.core.removeItem(followingId, objectId);
}
