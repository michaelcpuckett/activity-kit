import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { isLocal, getId } from '@activity-kit/utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoLike(
  this: OutboxPostEndpoint,
  activity: AP.Like,
) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const likedId = getId(actor.liked);

  assert.exists(likedId);

  await this.core.removeOrderedItem(likedId, objectId);

  try {
    const object = await this.core.queryById(objectId);

    assert.isApExtendedObject(object);

    const likesId = getId(object.likes);

    assert.exists(likesId);

    if (!isLocal(objectId)) {
      throw new Error('Cannot add to remote collection.');
    }

    const activityId = getId(activity);

    assert.exists(activityId);

    await this.core.removeOrderedItem(likesId, activityId);
  } catch (error) {
    console.log(error);
  }
}
