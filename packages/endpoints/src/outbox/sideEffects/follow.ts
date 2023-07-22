import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import {
  assertExists,
  assertIsApActor,
  assertIsApEntity,
  assertIsApType,
} from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleFollow(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Follow>(activity, AP.ActivityTypes.FOLLOW);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.core.findEntityById(objectId);

  assertIsApEntity(object);

  const actorId = getId(activity.actor);

  const actor = await this.core.queryById(actorId);

  assertIsApActor(actor);

  const requests = await this.core.getStreamByName(actor, 'Requests');
  const requestsId = getId(requests);

  await this.core.insertItem(requestsId, getId(activity));
}
