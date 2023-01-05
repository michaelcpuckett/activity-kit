import {
  AP,
  assertExists,
  assertIsApCollection,
  assertIsApExtendedObject,
  assertIsApType,
} from 'activitypub-core-types';
import {
  getId,
  isType,
} from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '..';

// An announcement has been made to a local object.
export async function handleAnnounce(
  this: InboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Announce>(activity, AP.ActivityTypes.ANNOUNCE);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.adapters.db.findEntityById(objectId);

  try {
    assertIsApExtendedObject(object);

    const sharesId = getId(object.shares);
    const shares = await this.adapters.db.findEntityById(sharesId);

    assertIsApCollection(shares);

    if (isType(shares, AP.CollectionTypes.COLLECTION)) {
      await this.adapters.db.insertItem(sharesId, activity.id);
    } else if (isType(shares, AP.CollectionTypes.ORDERED_COLLECTION)) {
      await this.adapters.db.insertOrderedItem(sharesId, activity.id);
    }
  } catch (error) {
    console.log(error);
  }
}
