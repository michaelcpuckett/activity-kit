import * as AP from '@activity-kit/types';
import {
  assertExists,
  assertIsApActor,
  assertIsApExtendedObject,
  assertIsApType,
} from '@activity-kit/type-utilities';
import { isLocal, getId } from '@activity-kit/utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoLike(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const actorId = getId((activity as AP.Activity).actor);
  const actor = await this.core.queryById(actorId);

  assertIsApActor(actor);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const likedId = getId(actor.liked);

  assertExists(likedId);

  await this.core.removeOrderedItem(likedId, objectId);

  try {
    const object = await this.core.queryById(objectId);

    assertIsApExtendedObject(object);

    const likesId = getId(object.likes);

    assertExists(likesId);

    if (!isLocal(objectId)) {
      throw new Error('Cannot add to remote collection.');
    }

    await this.core.removeOrderedItem(likesId, activity.id);
  } catch (error) {
    console.log(error);
  }
}
