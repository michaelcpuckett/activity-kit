import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import {
  assertExists,
  assertIsApEntity,
  assertIsApType,
} from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleDelete(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Delete>(activity, AP.ActivityTypes.DELETE);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.core.findEntityById(objectId);

  assertIsApEntity(object);

  activity.object = {
    id: objectId,
    url: objectId,
    type: AP.CoreObjectTypes.TOMBSTONE,
    deleted: new Date(),
    formerType: object.type,
  };

  await this.core.saveEntity(activity.object);
}
