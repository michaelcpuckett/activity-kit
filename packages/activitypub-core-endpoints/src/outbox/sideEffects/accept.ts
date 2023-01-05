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

  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const followersId = getId(actor.followers);

  assertExists(followersId);

  const followActivityId = getId(activity.object);
  const followActivity = await this.adapters.db.queryById(followActivityId);

  assertIsApType<AP.Follow>(followActivity, AP.ActivityTypes.FOLLOW);

  const followerId = getId(followActivity.actor);

  assertExists(followerId);

  const requests = await this.adapters.db.getStreamByName(actor, 'Requests');

  assertIsApType<AP.Collection>(requests, AP.CollectionTypes.COLLECTION);

  const requestsId = getId(requests);

  assertExists(requestsId);

  await Promise.all([
    this.adapters.db.insertItem(followersId, followerId),
    this.adapters.db.removeItem(requestsId, followActivityId),
  ]);
}
