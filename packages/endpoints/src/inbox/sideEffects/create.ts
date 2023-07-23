import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '..';

// A create has been made, potentially in reply to a local object.
export async function handleCreate(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
) {
  assert.isApType<AP.Create>(activity, AP.ActivityTypes.CREATE);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const existingObject = await this.core.findEntityById(objectId);

  if (existingObject) {
    console.log('We have already received this object.');
    return;
  }

  const object = await this.core.queryById(objectId);

  assert.isApEntity(object);

  // Cache the object for comparison later.
  await this.core.saveEntity(object);

  try {
    assert.isApExtendedObject(object);

    const inReplyToId = getId(object.inReplyTo);

    if (!inReplyToId) {
      // Not applicable.
      return;
    }

    assert.exists(inReplyToId);

    const inReplyTo = await this.core.findEntityById(inReplyToId);

    assert.isApExtendedObject(inReplyTo);

    const repliesCollectionId = getId(inReplyTo.replies);

    assert.exists(repliesCollectionId);

    const repliesCollection = await this.core.findEntityById(
      repliesCollectionId,
    );

    assert.isApCollection(repliesCollection);

    const attributedToId = getId(repliesCollection.attributedTo);

    assert.exists(attributedToId);

    console.log(attributedToId.toString(), getId(recipient)?.toString());

    if (attributedToId.toString() !== getId(recipient)?.toString()) {
      console.log('Not applicable to this Actor.');
      return;
    }

    await this.core.insertOrderedItem(repliesCollectionId, objectId);
  } catch (error) {
    console.log(error);
  }
}
