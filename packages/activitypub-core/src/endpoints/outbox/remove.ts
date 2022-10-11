import { AP } from 'activitypub-core-types';
import { DatabaseService } from '../../DatabaseService';
import { getId } from '../../utilities/getId';

/**
 * [x] Remove object from the target Collection, unless not allowed due to
 * requirements in 7.5 (outbox:remove:removes-from-target) SHOULD
 */

export async function handleRemove(
  activity: AP.Remove | AP.Add,
  databaseService: DatabaseService,
) {
  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('Bad request 1');
  }

  if (!activity.target) {
    throw new Error('Must have target.');
  }

  const activityTargetId = getId(activity.target);

  if (!activityTargetId) {
    throw new Error('Bad request 2');
  }

  // Only find local targets
  const expandedTarget = await databaseService.findEntityById(activityTargetId);

  if (!expandedTarget) {
    throw new Error('Bad request 3');
  }

  await databaseService.removeOrderedItem(activityTargetId, activityObjectId);
}
