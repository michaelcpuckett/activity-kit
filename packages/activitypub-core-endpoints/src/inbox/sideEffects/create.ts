import {
  AP,
  assertExists,
  assertIsApCollection,
  assertIsApEntity,
  assertIsApExtendedObject,
  assertIsApType,
} from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '..';

// A create has been made, potentially in reply to a local object.
export async function handleCreate(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
) {
  assertIsApType<AP.Create>(activity, AP.ActivityTypes.CREATE);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const existingObject = await this.adapters.db.findEntityById(objectId);

  if (existingObject) {
    console.log('We have already received this object.');
    return;
  }

  const object = await this.adapters.db.queryById(objectId);

  assertIsApEntity(object);

  // Cache the object for comparison later.
  await this.adapters.db.saveEntity(object);

  try {
    assertIsApExtendedObject(object);

    const inReplyToId = getId(object.inReplyTo);

    assertExists(inReplyToId);

    const inReplyTo = await this.adapters.db.findEntityById(inReplyToId);

    assertIsApExtendedObject(inReplyTo);

    const repliesCollectionId = getId(inReplyTo.replies);

    assertExists(repliesCollectionId);

    const repliesCollection = await this.adapters.db.findEntityById(
      repliesCollectionId,
    );

    assertIsApCollection(repliesCollection);

    const attributedToId = getId(repliesCollection.attributedTo);

    assertExists(attributedToId);

    if (attributedToId.toString() !== getId(recipient)?.toString()) {
      // Not applicable to this Actor.
      return;
    }

    await this.adapters.db.insertOrderedItem(repliesCollectionId, objectId);
  } catch (error) {
    console.log(error);
  }
}
