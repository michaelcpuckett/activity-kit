import { assert } from '@activity-kit/type-utilities';
import * as AP from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '..';

// An announcement has been made to a local object.
export async function handleAnnounce(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
) {
  assert.isApType<AP.Announce>(activity, AP.ActivityTypes.ANNOUNCE);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const object = await this.core.findEntityById(objectId);

  try {
    assert.isApExtendedObject(object);

    const sharesId = getId(object.shares);
    const shares = await this.core.findEntityById(sharesId);

    assert.isApCollection(shares);

    const attributedToId = getId(shares.attributedTo);

    assert.exists(attributedToId);

    if (attributedToId.toString() !== getId(recipient)?.toString()) {
      // Not applicable to this Actor.
      return;
    }

    if (
      Array.isArray(shares.type)
        ? shares.type.includes(AP.CollectionTypes.COLLECTION)
        : shares.type === AP.CollectionTypes.COLLECTION
    ) {
      await this.core.insertItem(sharesId, activity.id);
    } else if (
      Array.isArray(shares.type)
        ? shares.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
        : shares.type === AP.CollectionTypes.ORDERED_COLLECTION
    ) {
      await this.core.insertOrderedItem(sharesId, activity.id);
    }
  } catch (error) {
    console.log(error);
  }
}
