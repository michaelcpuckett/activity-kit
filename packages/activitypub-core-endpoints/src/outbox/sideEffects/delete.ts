import { OutboxPostHandler } from '..';
import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function handleDelete(this: OutboxPostHandler, activity?: AP.Entity) {
  activity = activity || this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: not ID.');
  }

  const object = await this.databaseService.findEntityById(objectId);

  if (!object || !object.type) {
    throw new Error('Bad object: not found.');
  }

  activity.object = {
    id: objectId,
    url: objectId,
    type: AP.CoreObjectTypes.TOMBSTONE,
    deleted: new Date(),
    formerType: object.type,
    ...(object.created
      ? {
          created: object.created,
        }
      : null),
  };

  await this.databaseService.saveEntity(activity.object);
}
