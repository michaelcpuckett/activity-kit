import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '..';

export async function handleUpdate(this: OutboxPostEndpoint) {
  if (!('object' in this.activity)) {
    throw new Error('Bad activity: no object.');
  }

  const actorId = getId((this.activity as AP.Activity).actor);

  if (!actorId) {
    throw new Error('Bad actor: no ID.');
  }

  const actor = await this.adapters.db.findEntityById(actorId);

  if (!actor) {
    throw new Error('Bad actor: not found.');
  }

  if (
    !isActorAuthorizedToModifyObject(
      actor as AP.Actor,
      this.activity as AP.Activity,
    )
  ) {
    throw new Error('Not authorized to modify object!');
  }

  if (this.activity.object instanceof URL) {
    throw new Error(
      'Bad activity: Providing a URL for the object is not sufficient for Update.',
    );
  }

  if (Array.isArray(this.activity.object)) {
    throw new Error(
      'Internal server error: Object arrays not supported. TODO.',
    );
  }

  const objectId = getId(this.activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.db.findEntityById(objectId);

  if (!object) {
    throw new Error('Bad object: Not found.');
  }

  this.activity.object = {
    ...object,
    ...this.activity.object,
    ...(object.type !== 'Link' && object.type !== 'Mention'
      ? {
          updated: new Date(),
        }
      : null),
  };

  await this.adapters.db.saveEntity(this.activity.object);
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
