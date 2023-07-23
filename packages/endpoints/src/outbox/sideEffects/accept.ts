import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleAccept(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assert.isApType<AP.Accept>(activity, AP.ActivityTypes.ACCEPT);

  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const followersId = getId(actor.followers);

  assert.exists(followersId);

  const followActivityId = getId(activity.object);
  const followActivity = await this.core.queryById(followActivityId);

  assert.isApType<AP.Follow>(followActivity, AP.ActivityTypes.FOLLOW);

  const followerId = getId(followActivity.actor);

  assert.exists(followerId);

  const requests = await this.core.getStreamByName(actor, 'Requests');

  assert.isApType<AP.Collection>(requests, AP.CollectionTypes.COLLECTION);

  const requestsId = getId(requests);

  assert.exists(requestsId);

  await Promise.all([
    this.core.insertItem(followersId, followerId),
    this.core.removeItem(requestsId, followActivityId),
  ]);
}
