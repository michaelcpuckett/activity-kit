import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

import { InboxPostEndpoint } from '..';

export async function handleLike(
  this: InboxPostEndpoint,
  activity: AP.Like,
  recipient: AP.Actor,
) {
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

    if (attributedToId.href !== getId(recipient)?.href) {
      // Not applicable to this Actor.
      return;
    }

    const activityId = getId(activity);

    assert.exists(activityId);

    if (
      guard.isApType<AP.OrderedCollection>(
        likes,
        AP.CollectionTypes.ORDERED_COLLECTION,
      )
    ) {
      await this.core.insertOrderedItem(likesId, activityId);
    } else {
      await this.core.insertItem(likesId, activityId);
    }
  } catch (error) {
    console.log(error);
  }
}
