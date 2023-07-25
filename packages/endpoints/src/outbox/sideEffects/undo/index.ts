import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndo(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assert.isApType<AP.Undo>(activity, AP.ActivityTypes.UNDO);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const object = await this.core.findEntityById(objectId);

  assert.isApActivity(object);

  if (!isActorAuthorizedToModifyObject(this.actor, activity)) {
    throw new Error('Not authorized to modify object!');
  }

  // Run side effects.
  if (guard.isApType<AP.Create>(object, AP.ActivityTypes.CREATE)) {
    await this.handleDelete(object);
  }

  if (guard.isApType<AP.Follow>(object, AP.ActivityTypes.FOLLOW)) {
    await this.handleUndoFollow(object);
  }

  if (guard.isApType<AP.Accept>(object, AP.ActivityTypes.ACCEPT)) {
    await this.handleUndoAccept(object);
  }

  if (guard.isApType<AP.Block>(object, AP.ActivityTypes.BLOCK)) {
    await this.handleUndoBlock(object);
  }

  if (guard.isApType<AP.Like>(object, AP.ActivityTypes.LIKE)) {
    await this.handleUndoLike(object);
  }

  if (guard.isApType<AP.Announce>(object, AP.ActivityTypes.ANNOUNCE)) {
    await this.handleUndoAnnounce(object);
  }

  if (guard.isApType<AP.Add>(object, AP.ActivityTypes.ADD)) {
    await this.handleRemove(object);
  }

  if (guard.isApType<AP.Remove>(object, AP.ActivityTypes.REMOVE)) {
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
