import { getId } from 'activitypub-core-utilities';
import { InboxEndpoint } from '..';

export async function handleCreate(this: InboxEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const object = activity.object;

  if ('inReplyTo' in object && object.inReplyTo) {
    const objectInReplyTo = await this.databaseService.findEntityById(
      getId(object.inReplyTo),
    );

    if (objectInReplyTo) {
      const repliesCollectionId = getId(objectInReplyTo.replies);

      if (repliesCollectionId) {
        await this.databaseService.insertOrderedItem(
          repliesCollectionId,
          object.id,
        );
      }
    }
  }
}
