import { AP, assertIsApActivity, assertIsApType } from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndo(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Undo>(activity, AP.ActivityTypes.UNDO);

  const objectId = getId(activity.object);
  const object = await this.layers.data.findEntityById(objectId);

  assertIsApActivity(object);

  if (!isActorAuthorizedToModifyObject(this.actor, activity)) {
    throw new Error('Not authorized to modify object!');
  }

  // Run side effects.
  if (isType(object, AP.ActivityTypes.CREATE)) {
    await this.handleDelete(object);
  }

  if (isType(object, AP.ActivityTypes.FOLLOW)) {
    await this.handleUndoFollow(object);
  }

  if (isType(object, AP.ActivityTypes.ACCEPT)) {
    await this.handleUndoAccept(object);
  }

  if (isType(object, AP.ActivityTypes.BLOCK)) {
    await this.handleUndoBlock(object);
  }

  if (isType(object, AP.ActivityTypes.LIKE)) {
    await this.handleUndoLike(object);
  }

  if (isType(object, AP.ActivityTypes.ANNOUNCE)) {
    await this.handleUndoAnnounce(object);
  }

  if (isType(object, AP.ActivityTypes.ADD)) {
    await this.handleRemove(object);
  }

  if (isType(object, AP.ActivityTypes.REMOVE)) {
    await this.handleAdd(object);
  }
}

function isActorAuthorizedToModifyObject(
  initiator: AP.Actor,
  activity: AP.Activity,
) {
  const initiatorId = getId(initiator);

  if (!initiatorId) {
    return false;
  }

  if (
    Array.isArray(activity.attributedTo) &&
    activity.attributedTo.find((reference) => {
      const id = getId(reference);
      if (id && id.toString() === initiatorId.toString()) {
        return true;
      }
    })
  ) {
    return true;
  }
  const activityActorId = getId(activity.actor);
  const activityActorAttributedTo = getId(activity.attributedTo);

  if (activityActorId?.toString() === initiatorId.toString()) {
    return true;
  }

  if (activityActorAttributedTo?.toString() === initiatorId.toString()) {
    return true;
  }
}
