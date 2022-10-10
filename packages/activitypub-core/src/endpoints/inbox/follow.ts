import { AP } from '../../types';
import { DatabaseService } from '../../DatabaseService';
import { getTypedEntity } from '../../utilities/getTypedEntity';
import { getGuid } from '../../utilities/getGuid';
import {
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
  PUBLIC_ACTOR,
} from '../../globals';
import { getId } from '../../utilities/getId';
import { DeliveryService } from '../../DeliveryService';

export async function handleFollow(
  activity: AP.Follow,
  databaseService: DatabaseService,
  deliveryService: DeliveryService,
): Promise<void> {
  if (!activity.id) {
    throw new Error('bad request');
  }

  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('No object id');
  }

  const foundObject = await databaseService.queryById(activityObjectId);

  if (!foundObject || !foundObject.type || !foundObject.id) {
    throw new Error('No found object');
  }

  const typedObject = getTypedEntity(foundObject);

  if (!typedObject || !('inbox' in typedObject)) {
    return;
  }

  const activityActorId = getId(activity.actor);

  if (!activityActorId) {
    throw new Error('Bad request 1');
  }

  const foundActor = await databaseService.queryById(activityActorId);

  if (!foundActor || !foundActor.type) {
    throw new Error('No actor found');
  }

  const typedActor = getTypedEntity(foundActor);

  if (!typedActor || !('inbox' in typedActor)) {
    throw new Error('actor not an actor?');
  }

  const follower = typedActor;
  const followee = typedObject;

  if (!(follower.id && followee.id)) {
    return;
  }

  // Now we're in outbox, because this is auto-generated:

  const acceptActivityId = `${LOCAL_DOMAIN}/activity/${getGuid()}`;

  const acceptActivity: AP.Accept = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(acceptActivityId),
    url: new URL(acceptActivityId),
    type: AP.ActivityTypes.ACCEPT,
    actor: followee.id,
    object: activity.id,
    to: [new URL(PUBLIC_ACTOR), follower.id],
  };

  const followeeOutboxId = getId(followee.outbox);

  if (!followeeOutboxId) {
    throw new Error('No followee Outbox ID');
  }

  const followeeFollowersId = getId(followee.followers);

  if (!followeeFollowersId) {
    throw new Error('no followee Followers ID');
  }

  if (!acceptActivity.id) {
    throw new Error('bad request');
  }

  await Promise.all([
    databaseService.saveEntity(acceptActivity),
    databaseService.insertOrderedItem(followeeOutboxId, acceptActivity.id),
    databaseService.insertItem(followeeFollowersId, follower.id),
  ]);

  await deliveryService.broadcast(acceptActivity, followee);
}
