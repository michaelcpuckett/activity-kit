import {
  AP,
  assertExists,
  assertIsApCollection,
  assertIsApExtendedObject,
  assertIsApType,
} from '@activity-kit/types';
import { getId, isType } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '..';

// An announcement has been made to a local object.
export async function handleAnnounce(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
) {
  assertIsApType<AP.Announce>(activity, AP.ActivityTypes.ANNOUNCE);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.core.findEntityById(objectId);

  try {
    assertIsApExtendedObject(object);

    const sharesId = getId(object.shares);
    const shares = await this.core.findEntityById(sharesId);

    assertIsApCollection(shares);

    const attributedToId = getId(shares.attributedTo);

    assertExists(attributedToId);

    if (attributedToId.toString() !== getId(recipient)?.toString()) {
      // Not applicable to this Actor.
      return;
    }

    if (isType(shares, AP.CollectionTypes.COLLECTION)) {
      await this.core.insertItem(sharesId, activity.id);
    } else if (isType(shares, AP.CollectionTypes.ORDERED_COLLECTION)) {
      await this.core.insertOrderedItem(sharesId, activity.id);
    }
  } catch (error) {
    console.log(error);
  }
}
