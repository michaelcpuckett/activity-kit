import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleFollow(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assert.isApType<AP.Follow>(activity, AP.ActivityTypes.FOLLOW);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const object = await this.core.findEntityById(objectId);

  assert.isApEntity(object);

  const actorId = getId(activity.actor);

  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const requests = await this.core.getStreamByName(actor, 'Requests');
  const requestsId = getId(requests);

  await this.core.insertItem(requestsId, getId(activity));
}
