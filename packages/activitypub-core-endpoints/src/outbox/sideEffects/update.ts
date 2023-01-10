import {
  AP,
  assertIsApActor,
  assertIsApEntity,
  assertIsApType,
} from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '..';

export async function handleUpdate(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Update>(activity, AP.ActivityTypes.UPDATE);

  const actorId = getId(activity.actor);
  const actor = await this.adapters.db.findEntityById(actorId);

  assertIsApActor(actor);

  if (activity.object instanceof URL) {
    throw new Error(
      'Bad activity: Providing a URL for the object is not sufficient for Update.',
    );
  }

  if (Array.isArray(activity.object)) {
    throw new Error(
      'Internal server error: Object arrays not supported. TODO.',
    );
  }

  if (!isActorAuthorizedToModifyObject(actor, activity)) {
    throw new Error('Not authorized to modify object!');
  }

  const objectId = getId(activity.object);
  const object = await this.adapters.db.findEntityById(objectId);

  assertIsApEntity(object);

  activity.object = {
    ...object,
    ...activity.object,
    ...(object.type !== 'Link' && object.type !== 'Mention'
      ? {
          updated: new Date(),
        }
      : null),
  };

  await this.adapters.db.saveEntity(activity.object);
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

  const actorId = getId(activity.actor);
  const attributedTo = getId(activity.attributedTo);

  if (actorId?.toString() === initiatorId.toString()) {
    return true;
  }

  if (attributedTo?.toString() === initiatorId.toString()) {
    return true;
  }
}
