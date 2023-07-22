import { getId } from '@activity-kit/utilities';
import * as AP from '@activity-kit/types';
import {
  assertExists,
  assertIsApActor,
  assertIsApType,
} from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoAccept(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Accept>(activity, AP.ActivityTypes.ACCEPT);

  const actorId = getId(activity.actor);
  const actor = await this.core.findEntityById(actorId);

  assertIsApActor(actor);

  const followersId = getId(actor.followers);

  assertExists(followersId);

  const followId = getId(activity.object);
  const follow = await this.core.queryById(followId);

  assertIsApType<AP.Follow>(follow, AP.ActivityTypes.FOLLOW);

  const followerId = getId(follow.actor);

  assertExists(followerId);

  await this.core.removeItem(followersId, followerId);
}
