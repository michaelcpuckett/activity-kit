import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { handleRemove } from '../remove';
import { handleAdd } from '../add';
import { handleUndoLike } from './undoLike';
import { handleUndoAnnounce } from './undoAnnounce';
import { handleDelete } from '../delete';
import type { Database } from 'activitypub-core-types';

/**
 * Undo
 *   [x] Supports the Undo activity in the client-to-server protocol (outbox:undo)
 *     NON-NORMATIVE
 *   [x] Ensures that the actor in the activity actor is the same in activity being
 *     undone (outbox:undo:ensures-activity-and-actor-are-same) MUST
 */

export async function handleUndo(
  activity: AP.Undo,
  databaseService: Database,
  initiator: AP.Actor,
) {
  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('No activity object');
  }

  const activityObject = await databaseService.findEntityById(activityObjectId);

  if (!activityObject) {
    throw new Error('No activity object');
  }

  if (!isAuthorizedToModifyObject(initiator, activity)) {
    throw new Error('Not authorized');
  }

  // Run side effects.
  switch (activityObject.type) {
    case AP.ActivityTypes.CREATE:
      await handleDelete(activityObject, databaseService);
      break;
    // case AP.ActivityTypes.DELETE:
    //   await handleUndoDelete(activityObject, databaseService, initiator);
    //   break;
    // case AP.ActivityTypes.UPDATE:
    //   await handleUndoUpdate(activityObject as AP.Update, databaseService, initiator);
    //   break;
    case AP.ActivityTypes.LIKE:
      await handleUndoLike(activityObject as AP.Like, databaseService);
      break;
    case AP.ActivityTypes.ANNOUNCE:
      await handleUndoAnnounce(activityObject as AP.Announce, databaseService);
      break;
    case AP.ActivityTypes.ADD:
      await handleRemove(activityObject, databaseService);
      break;
    case AP.ActivityTypes.REMOVE:
      await handleAdd(activityObject, databaseService);
      break;
  }
}

function isAuthorizedToModifyObject(
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
