import { OutboxPostEndpoint } from '..';
import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApEntity,
  assertIsApExtendedObject,
  assertIsApType,
} from 'activitypub-core-types';
import { getCollectionNameByUrl, getId } from 'activitypub-core-utilities';

export async function handleLike(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const actorId = getId(activity.actor);
  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.adapters.db.queryById(objectId);

  assertIsApEntity(object);

  const likedId = getId(actor.liked);

  assertExists(likedId);

  await this.adapters.db.insertOrderedItem(likedId, objectId);

  try {
    assertIsApExtendedObject(object);

    const likesId = getId(object.likes);

    assertExists(likesId);

    const isLocal = getCollectionNameByUrl(objectId) !== 'foreignEntity';

    if (!isLocal) {
      throw new Error('Cannot add to remote collection.');
    }

    await this.adapters.db.insertOrderedItem(likesId, activity.id);
  } catch (error) {
    console.log(error);
  }
}
