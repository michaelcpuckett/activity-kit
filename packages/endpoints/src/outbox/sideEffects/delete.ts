import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleDelete(
  this: OutboxPostEndpoint,
  activity: AP.Delete | AP.Create,
) {
  const objectId = getId(activity.object);

  assert.exists(objectId);

  const object = await this.core.findEntityById(objectId);

  assert.isApEntity(object);

  activity.object = {
    id: objectId,
    url: objectId,
    type: AP.CoreObjectTypes.TOMBSTONE,
    deleted: new Date(),
    formerType: object.type,
  };

  await this.core.saveEntity(activity.object);
}
