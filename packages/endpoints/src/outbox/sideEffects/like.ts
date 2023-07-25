import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { isLocal, getId } from '@activity-kit/utilities';

export async function handleLike(this: OutboxPostEndpoint, activity: AP.Like) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const object = await this.core.queryById(objectId);

  assert.isApEntity(object);

  const likedId = getId(actor.liked);

  assert.exists(likedId);

  await this.core.insertOrderedItem(likedId, objectId);

  try {
    assert.isApExtendedObject(object);

    const likesId = getId(object.likes);

    assert.exists(likesId);

    if (!isLocal(objectId)) {
      throw new Error('Cannot add to remote collection.');
    }

    const activityId = getId(activity);

    assert.exists(activityId);

    await this.core.insertOrderedItem(likesId, activityId);
  } catch (error) {
    console.log(error);
  }
}
