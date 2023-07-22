import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import {
  assertExists,
  assertIsApActor,
  assertIsApType,
} from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleAccept(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Accept>(activity, AP.ActivityTypes.ACCEPT);

  const actorId = getId(activity.actor);

  assertExists(actorId);

  const actor = await this.core.queryById(actorId);

  assertIsApActor(actor);

  const followersId = getId(actor.followers);

  assertExists(followersId);

  const followActivityId = getId(activity.object);
  const followActivity = await this.core.queryById(followActivityId);

  assertIsApType<AP.Follow>(followActivity, AP.ActivityTypes.FOLLOW);

  const followerId = getId(followActivity.actor);

  assertExists(followerId);

  const requests = await this.core.getStreamByName(actor, 'Requests');

  assertIsApType<AP.Collection>(requests, AP.CollectionTypes.COLLECTION);

  const requestsId = getId(requests);

  assertExists(requestsId);

  await Promise.all([
    this.core.insertItem(followersId, followerId),
    this.core.removeItem(requestsId, followActivityId),
  ]);
}
