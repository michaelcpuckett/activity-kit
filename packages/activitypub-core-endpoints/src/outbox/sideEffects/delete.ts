import { OutboxPostHandler } from '..';
import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function handleDelete(
  this: OutboxPostHandler
) {
  if (!('object' in this.activity)) {
    return;
  }
  const objectId = getId(this.activity.object);

  if (!objectId) {
    throw new Error('Bad object: not ID.');
  }

  const object = await this.databaseService.findEntityById(objectId);

  if (!object || !object.type) {
    throw new Error('Bad object: not found.');
  }

  this.activity.object = {
    id: objectId,
    url: objectId,
    type: AP.CoreObjectTypes.TOMBSTONE,
    deleted: new Date(),
    formerType: object.type,
    ...object.created ? {
      created: object.created
    } : null,
  };

  await this.databaseService.saveEntity(this.activity.object);
}
