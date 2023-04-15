import { OutboxPostEndpoint } from '..';
import {
  AP,
  assertExists,
  assertIsApEntity,
  assertIsApType,
} from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function handleDelete(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Delete>(activity, AP.ActivityTypes.DELETE);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.lib.findEntityById(objectId);

  assertIsApEntity(object);

  activity.object = {
    id: objectId,
    url: objectId,
    type: AP.CoreObjectTypes.TOMBSTONE,
    deleted: new Date(),
    formerType: object.type,
  };

  await this.lib.saveEntity(activity.object);
}
