import {
  AP,
  assertExists,
  assertIsApCollection,
  assertIsApEntity,
  assertIsApExtendedObject,
  assertIsApType,
} from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '..';

// A Like has been made to a local object.
export async function handleLike(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
) {
  assertIsApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.adapters.db.findEntityById(objectId);

  assertIsApEntity(object);

  try {
    assertIsApExtendedObject(object);

    const likesId = getId(object.likes);

    assertExists(likesId);

    const likes = await this.adapters.db.findEntityById(likesId);

    assertIsApCollection(likes);

    const attributedToId = getId(likes.attributedTo);

    assertExists(attributedToId);

    if (attributedToId.toString() !== getId(recipient)?.toString()) {
      // Not applicable to this Actor.
      return;
    }

    if (isType(likes, AP.CollectionTypes.COLLECTION)) {
      await this.adapters.db.insertItem(likesId, activity.id);
    } else if (isType(likes, AP.CollectionTypes.ORDERED_COLLECTION)) {
      await this.adapters.db.insertOrderedItem(likesId, activity.id);
    }
  } catch (error) {
    console.log(error);
  }
}
