import { AP, assertExists, assertIsApActor, assertIsApEntity, assertIsApExtendedObject, assertIsApType } from 'activitypub-core-types';
import { getCollectionNameByUrl, getId } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoLike(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const actorId = getId((activity as AP.Activity).actor);
  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const objectId = getId(activity.object);

  assertExists(objectId);
 
  const likedId = getId(actor.liked);

  assertExists(likedId);

  await this.adapters.db.removeOrderedItem(likedId, objectId);

  try {
    const object = await this.adapters.db.queryById(objectId);

    assertIsApExtendedObject(object);

    const likesId = getId(object.likes);

    assertExists(likesId);

    const isLocal = getCollectionNameByUrl(objectId) !== 'foreign-entity';

    if (!isLocal) {
      throw new Error('Cannot add to remote collection.');
    }

    await this.adapters.db.removeOrderedItem(likesId, activity.id);
  } catch (error) {
    console.log(error);
  }
}
