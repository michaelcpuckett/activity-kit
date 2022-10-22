import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import {
  getId,
  getTypedEntity,
  getCollectionNameByUrl,
} from 'activitypub-core-utilities';

export async function handleCreate(
  activity: AP.Create,
  databaseService: Database,
): Promise<void> {
  if (!activity.id || !activity.object) {
    throw new Error('bad request; no id/object');
  }

  const typedObject = getTypedEntity(
    activity.object as { [key: string]: unknown },
  );

  if (!typedObject) {
    throw new Error('No object');
  }

  if ('inReplyTo' in typedObject && typedObject.inReplyTo) {
    const objectInReplyTo = await databaseService.findEntityById(
      getId(typedObject.inReplyTo),
    );

    if (objectInReplyTo) {
      const repliesCollectionId = getId(objectInReplyTo.replies);

      if (repliesCollectionId) {
        await databaseService.insertOrderedItem(
          repliesCollectionId,
          typedObject.id,
        );
      }
    }
  }
}
