import { getId } from 'activitypub-core-utilities';
import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApType,
} from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoAccept(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Accept>(activity, AP.ActivityTypes.ACCEPT);

  const actorId = getId(activity.actor);
  const actor = await this.lib.findEntityById(actorId);

  assertIsApActor(actor);

  const followersId = getId(actor.followers);

  assertExists(followersId);

  const followId = getId(activity.object);
  const follow = await this.lib.queryById(followId);

  assertIsApType<AP.Follow>(follow, AP.ActivityTypes.FOLLOW);

  const followerId = getId(follow.actor);

  assertExists(followerId);

  await this.lib.removeItem(followersId, followerId);
}
