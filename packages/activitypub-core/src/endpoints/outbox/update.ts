import { AP } from 'activitypub-core-types';
import { DatabaseService } from '../../DatabaseService';
import { getId } from '../../utilities/getId';

export async function handleUpdate(
  activity: AP.Update,
  databaseService: DatabaseService,
) {
  const actorId = getId(activity.actor);

  if (!actorId) {
    throw new Error('No actor?');
  }

  const actor = await databaseService.findEntityById(actorId);

  if (!actor) {
    throw new Error('No actor?');
  }

  if (!isAuthorizedToModifyObject(actor as AP.Actor, activity)) {
    throw new Error('Not authorized');
  }

  if (activity.object instanceof URL || Array.isArray(activity.object)) {
    throw new Error('bad request');
  }

  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('Bad request xxx1');
  }

  const objectToUpdate = await databaseService.findEntityById(activityObjectId);

  if (!objectToUpdate || !objectToUpdate.type) {
    throw new Error('bad request xxx');
  }

  if (
    !activity.object ||
    objectToUpdate instanceof URL ||
    activity.object instanceof URL
  ) {
    throw new Error('bad request x2');
  }

  activity.object = {
    ...objectToUpdate,
    ...activity.object,
    ...(objectToUpdate.type !== 'Link' && objectToUpdate.type !== 'Mention'
      ? {
        updated: new Date(),
      }
      : null),
  };

  if (!activity.object.type || !activity.object.id) {
    throw new Error('??');
  }

  await databaseService.saveEntity(activity.object);
}

function isAuthorizedToModifyObject(initiator: AP.Actor, activity: AP.Update) {
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
