import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function handleAccept(
  activity: AP.Accept,
  databaseService: Database,
): Promise<void> {
  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('Bad request 1');
  }

  const foundThing = await databaseService.queryById(activityObjectId);

  if (!foundThing || !foundThing.type) {
    throw new Error('bad request 2');
  }

  if (foundThing.type !== AP.ActivityTypes.FOLLOW) {
    return;
  }

  const followActivity: AP.Follow = foundThing;
  const followerId = getId(followActivity.actor);
  const followeeId = getId(followActivity.object);

  if (!followerId || !followeeId) {
    throw new Error('bad request 4');
  }

  const foundFollower = await databaseService.queryById(followerId);

  if (!foundFollower || !('outbox' in foundFollower)) {
    throw new Error('bad request 55');
  }

  const foundFollowee = await databaseService.queryById(followeeId);

  if (!foundFollowee || !('outbox' in foundFollowee)) {
    throw new Error('bad request 5');
  }

  const followeeFollowersId = getId(foundFollowee.followers);

  if (!followeeFollowersId) {
    throw new Error('bad request 6');
  }

  await databaseService.insertItem(followeeFollowersId, followerId);

  const followerFollowingId = getId(foundFollower.following);

  if (!followerFollowingId) {
    throw new Error('bad request 7');
  }

  await databaseService.insertItem(followerFollowingId, followeeId);
}
