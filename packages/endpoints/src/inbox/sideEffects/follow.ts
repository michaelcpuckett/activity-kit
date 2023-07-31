import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import {
  LOCAL_DOMAIN,
  PUBLIC_ACTOR,
  applyContext,
  getId,
} from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

import { InboxPostEndpoint } from '..';

export async function handleFollow(
  this: InboxPostEndpoint,
  activity: AP.Follow,
  recipient: AP.Actor,
) {
  const activityId = getId(activity);

  assert.exists(activityId);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const object = await this.core.queryById(objectId);

  assert.isApEntity(object);

  if (!guard.isApActor(object)) {
    // Not applicable.
    return;
  }

  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const follower = actor;
  const followerId = getId(follower);

  assert.exists(followerId);

  const followee = object;
  const followeeId = getId(followee);

  assert.exists(followeeId);

  if (followeeId.href !== getId(recipient)?.href) {
    // Not applicable to this Actor.
    return;
  }

  const followersId = getId(followee.followers);

  assert.exists(followersId);

  const followers = await this.core.findEntityById(followersId);

  assert.isApType<AP.Collection>(followers, AP.CollectionTypes.COLLECTION);
  assert.isArray(followers.items);

  // Already a follower.
  if (
    followers.items
      .map((id: AP.EntityReference) => id?.toString())
      .includes(followerId.toString())
  ) {
    console.log('Already a follower.');
    return;
  }

  if (followee.manuallyApprovesFollowers) {
    const requests = await this.core.getStreamByName(followee, 'Requests');

    assert.isApType<AP.Collection>(requests, AP.CollectionTypes.COLLECTION);

    const requestsId = getId(requests);

    assert.exists(requestsId);

    await this.core.insertItem(requestsId, activityId);

    return;
  }

  // Now we're in outbox, because this is auto-generated:

  const acceptActivityId = `${new URL(
    `${LOCAL_DOMAIN}${compile(this.routes.accept)({
      guid: await this.core.getGuid(),
    })}`,
  )}`;
  const publishedDate = new Date();

  const acceptActivity = applyContext({
    id: new URL(acceptActivityId),
    url: new URL(acceptActivityId),
    type: AP.ActivityTypes.ACCEPT,
    to: [new URL(PUBLIC_ACTOR), followerId],
    actor: followeeId,
    object: activityId,
    published: publishedDate,
  });

  const followeeOutboxId = getId(followee.outbox);

  assert.exists(followeeOutboxId);

  await Promise.all([
    this.core.saveEntity(acceptActivity),
    this.core.insertOrderedItem(followeeOutboxId, new URL(acceptActivityId)),
    this.core.insertItem(followersId, followerId),
  ]);

  await this.core.broadcast(acceptActivity, followee);
}
