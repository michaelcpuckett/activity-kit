import { AP } from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '../..';

/**
 * Undo
 *   [x] Supports the Undo activity in the client-to-server protocol (outbox:undo)
 *     NON-NORMATIVE
 *   [x] Ensures that the actor in the activity actor is the same in activity being
 *     undone (outbox:undo:ensures-activity-and-actor-are-same) MUST
 */

export async function handleUndo(this: OutboxPostEndpoint) {
  if (!('object' in this.activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(this.activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.db.findEntityById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (
    !isActorAuthorizedToModifyObject(this.actor, this.activity as AP.Activity)
  ) {
    throw new Error('Not authorized to modify object!');
  }

  // Run side effects.
  if (isType(object, AP.ActivityTypes.CREATE)) {
    await this.handleDelete(object);
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
