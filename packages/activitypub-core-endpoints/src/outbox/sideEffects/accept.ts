import { OutboxPostEndpoint } from '..';
import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApType,
} from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function handleAccept(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Accept>(activity, AP.ActivityTypes.ACCEPT);

  const actorId = getId(activity.actor);

  assertExists(actorId);

  const actor = await this.layers.data.queryById(actorId);

  assertIsApActor(actor);

  const followersId = getId(actor.followers);

  assertExists(followersId);

  const followActivityId = getId(activity.object);
  const followActivity = await this.layers.data.queryById(followActivityId);

  assertIsApType<AP.Follow>(followActivity, AP.ActivityTypes.FOLLOW);

  const followerId = getId(followActivity.actor);

  assertExists(followerId);

  const requests = await this.layers.data.getStreamByName(actor, 'Requests');

  assertIsApType<AP.Collection>(requests, AP.CollectionTypes.COLLECTION);

  const requestsId = getId(requests);

  assertExists(requestsId);

  await Promise.all([
    this.layers.data.insertItem(followersId, followerId),
    this.layers.data.removeItem(requestsId, followActivityId),
  ]);
}
