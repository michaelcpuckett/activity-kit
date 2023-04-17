import {
  AP,
  isType,
  assertIsApActivity,
  assertIsApType,
} from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndo(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Undo>(activity, AP.ActivityTypes.UNDO);

  const objectId = getId(activity.object);
  const object = await this.core.findEntityById(objectId);

  assertIsApActivity(object);

  if (!isActorAuthorizedToModifyObject(this.actor, activity)) {
    throw new Error('Not authorized to modify object!');
  }

  // Run side effects.
  if (isType<AP.Create>(object, AP.ActivityTypes.CREATE)) {
    await this.handleDelete(object);
  }

  if (isType<AP.Follow>(object, AP.ActivityTypes.FOLLOW)) {
    await this.handleUndoFollow(object);
  }

  if (isType<AP.Accept>(object, AP.ActivityTypes.ACCEPT)) {
    await this.handleUndoAccept(object);
  }

  if (isType<AP.Block>(object, AP.ActivityTypes.BLOCK)) {
    await this.handleUndoBlock(object);
  }

  if (isType<AP.Like>(object, AP.ActivityTypes.LIKE)) {
    await this.handleUndoLike(object);
  }

  if (isType<AP.Announce>(object, AP.ActivityTypes.ANNOUNCE)) {
    await this.handleUndoAnnounce(object);
  }

  if (isType<AP.Add>(object, AP.ActivityTypes.ADD)) {
    await this.handleRemove(object);
  }

  if (isType<AP.Remove>(object, AP.ActivityTypes.REMOVE)) {
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
