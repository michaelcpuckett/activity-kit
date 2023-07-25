import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { getId, getArray } from '@activity-kit/utilities';

import { OutboxPostEndpoint } from '..';

export async function handleUpdate(
  this: OutboxPostEndpoint,
  activity: AP.Update,
) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.findEntityById(actorId);

  assert.isApActor(actor);

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

  assert.exists(objectId);

  const existingObject = await this.core.findEntityById(objectId);

  assert.isApEntity(existingObject);

  const updatedObject: AP.Entity = {
    ...existingObject,
  };

  for (const key of Object.keys(activity.object)) {
    updatedObject[key] = activity.object[key];
  }

  if (guard.isApCoreObject(updatedObject)) {
    updatedObject.updated = new Date();
  }

  await this.core.saveEntity(updatedObject);
}

function isActorAuthorizedToModifyObject(
  initiator: AP.Actor,
  activity: AP.Activity,
): boolean {
  const initiatorId = getId(initiator);

  if (!guard.exists(initiatorId)) {
    return false;
  }

  const hasMatch = getArray(activity.attributedTo).find((attributedTo) => {
    const id = getId(attributedTo);
    return guard.exists(id) && id.href === initiatorId.href;
  });

  return !!hasMatch;
}
