import { AP } from 'activitypub-core-types';
import { DatabaseService } from '../../DatabaseService';
import { getId } from '../../utilities/getId';

export async function handleDelete(
  activity: AP.Delete | AP.Create,
  databaseService: DatabaseService,
) {
  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('Bad request 7');
  }

  const objectToDelete = await databaseService.findEntityById(activityObjectId);

  if (!objectToDelete || !objectToDelete.type) {
    throw new Error('bad request 8');
  }

  activity.object = {
    id: activityObjectId,
    url: activityObjectId,
    type: AP.CoreObjectTypes.TOMBSTONE,
    deleted: new Date(),
    formerType: objectToDelete.type,
  };

  await databaseService.saveEntity(activity.object);
}
