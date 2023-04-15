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

  const existingObject = await this.lib.findEntityById(objectId);

  if (existingObject) {
    console.log('We have already received this object.');
    return;
  }

  const object = await this.lib.queryById(objectId);

  assertIsApEntity(object);

  // Cache the object for comparison later.
  await this.lib.saveEntity(object);

  try {
    assertIsApExtendedObject(object);

    const inReplyToId = getId(object.inReplyTo);

    if (!inReplyToId) {
      // Not applicable.
      return;
    }

    assertExists(inReplyToId);

    const inReplyTo = await this.lib.findEntityById(inReplyToId);

    assertIsApExtendedObject(inReplyTo);

    const repliesCollectionId = getId(inReplyTo.replies);

    assertExists(repliesCollectionId);

    const repliesCollection = await this.lib.findEntityById(
      repliesCollectionId,
    );

    assertIsApCollection(repliesCollection);

    const attributedToId = getId(repliesCollection.attributedTo);

    assertExists(attributedToId);

    console.log(attributedToId.toString(), getId(recipient)?.toString());

    if (attributedToId.toString() !== getId(recipient)?.toString()) {
      console.log('Not applicable to this Actor.');
      return;
    }

    await this.lib.insertOrderedItem(repliesCollectionId, objectId);
  } catch (error) {
    console.log(error);
  }
}
