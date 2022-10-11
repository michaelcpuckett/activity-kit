import { AP } from 'activitypub-core-types';
import { DatabaseService } from '../../DatabaseService';
import { getId } from '../../utilities/getId';

export async function handleAdd(
  activity: AP.Add | AP.Remove,
  databaseService: DatabaseService,
) {
  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('No object ID');
  }

  if (!activity.target) {
    throw new Error('Must have target.');
  }

  const activityTargetId = getId(activity.target);

  if (!activityTargetId) {
    throw new Error('No target ID');
  }

  // Only find local targets
  const expandedTarget = await databaseService.findEntityById(activityTargetId);

  if (!expandedTarget) {
    throw new Error('Target not found, only local allowed');
  }

  // TODO: Check if actor "owns" this collection.

  if (
    'orderedItems' in expandedTarget &&
    Array.isArray(expandedTarget.orderedItems)
  ) {
    await databaseService.insertOrderedItem(activityTargetId, activityObjectId);
  } else if ('items' in expandedTarget && Array.isArray(expandedTarget.items)) {
    await databaseService.insertItem(activityTargetId, activityObjectId);
  } else {
    throw new Error('Target not a collection.');
  }
}
