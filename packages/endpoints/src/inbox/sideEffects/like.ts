import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '..';

// A Like has been made to a local object.
export async function handleLike(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
) {
  assert.isApType<AP.Like>(activity, AP.ActivityTypes.LIKE);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const object = await this.core.findEntityById(objectId);

  assert.isApEntity(object);

  try {
    assert.isApExtendedObject(object);

    const likesId = getId(object.likes);

    assert.exists(likesId);

    const likes = await this.core.findEntityById(likesId);

    assert.isApCollection(likes);

    const attributedToId = getId(likes.attributedTo);

    assert.exists(attributedToId);

    if (attributedToId.toString() !== getId(recipient)?.toString()) {
      // Not applicable to this Actor.
      return;
    }

    if (
      Array.isArray(likes.type)
        ? likes.type.includes(AP.CollectionTypes.COLLECTION)
        : likes.type === AP.CollectionTypes.COLLECTION
    ) {
      await this.core.insertItem(likesId, activity.id);
    } else if (
      Array.isArray(likes.type)
        ? likes.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
        : likes.type === AP.CollectionTypes.ORDERED_COLLECTION
    ) {
      await this.core.insertOrderedItem(likesId, activity.id);
    }
  } catch (error) {
    console.log(error);
  }
}
