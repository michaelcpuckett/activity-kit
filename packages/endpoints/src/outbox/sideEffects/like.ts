import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { isLocal, getId } from '@activity-kit/utilities';

export async function handleLike(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assert.isApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const actorId = getId(activity.actor);
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

    await this.core.insertOrderedItem(likesId, activity.id);
  } catch (error) {
    console.log(error);
  }
}
