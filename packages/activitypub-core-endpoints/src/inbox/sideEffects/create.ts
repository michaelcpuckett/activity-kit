import { getId } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from "..";

export async function handleCreate(this: InboxPostEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const object = activity.object;

  if ('inReplyTo' in object && object.inReplyTo) {
    const objectInReplyTo = await this.adapters.database.findEntityById(
      getId(object.inReplyTo),
    );

    if (objectInReplyTo) {
      const repliesCollectionId = getId(objectInReplyTo.replies);

      if (repliesCollectionId) {
        await this.adapters.database.insertOrderedItem(
          repliesCollectionId,
          object.id,
        );
      }
    }
  }
}
