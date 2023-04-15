import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApExtendedObject,
  assertIsApType,
} from 'activitypub-core-types';
import { isLocal, getId } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoLike(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const actorId = getId((activity as AP.Activity).actor);
  const actor = await this.lib.queryById(actorId);

  assertIsApActor(actor);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const likedId = getId(actor.liked);

  assertExists(likedId);

  await this.lib.removeOrderedItem(likedId, objectId);

  try {
    const object = await this.lib.queryById(objectId);

    assertIsApExtendedObject(object);

    const likesId = getId(object.likes);

    assertExists(likesId);

    if (!isLocal(objectId)) {
      throw new Error('Cannot add to remote collection.');
    }

    await this.lib.removeOrderedItem(likesId, activity.id);
  } catch (error) {
    console.log(error);
  }
}
