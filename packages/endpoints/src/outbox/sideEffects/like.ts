import { OutboxPostEndpoint } from '..';
import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApEntity,
  assertIsApExtendedObject,
  assertIsApType,
} from '@activity-kit/types';
import { isLocal, getId } from '@activity-kit/utilities';

export async function handleLike(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const actorId = getId(activity.actor);
  const actor = await this.core.queryById(actorId);

  assertIsApActor(actor);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.core.queryById(objectId);

  assertIsApEntity(object);

  const likedId = getId(actor.liked);

  assertExists(likedId);

  await this.core.insertOrderedItem(likedId, objectId);

  try {
    assertIsApExtendedObject(object);

    const likesId = getId(object.likes);

    assertExists(likesId);

    if (!isLocal(objectId)) {
      throw new Error('Cannot add to remote collection.');
    }

    await this.core.insertOrderedItem(likesId, activity.id);
  } catch (error) {
    console.log(error);
  }
}
