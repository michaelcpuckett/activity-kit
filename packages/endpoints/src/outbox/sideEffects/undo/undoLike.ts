import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { isLocal, getId } from '@activity-kit/utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoLike(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assert.isApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const actorId = getId((activity as AP.Activity).actor);
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

    await this.core.removeOrderedItem(likesId, activity.id);
  } catch (error) {
    console.log(error);
  }
}
