import { OutboxPostEndpoint } from '..';
import { AP } from 'activitypub-core-types';
import { getCollectionNameByUrl, getId } from 'activitypub-core-utilities';

export async function handleLike(this: OutboxPostEndpoint) {
  if (!('object' in this.activity)) {
    throw new Error('Bad activity: no object.');
  }

  if (!this.activity.id) {
    throw new Error('Bad activity: no ID.');
  }

  const actorId = getId((this.activity as AP.Activity).actor);

  if (!actorId) {
    throw new Error('Bad actor: no ID.');
  }

  const actor = await this.adapters.db.queryById(actorId);

  if (!actor || !('outbox' in actor)) {
    throw new Error('Bad actor: not found.');
  }

  const objectId = getId(this.activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.db.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: Not found.');
  }

  if (!('id' in object) || !object.id) {
    throw new Error('Bad object: No ID.');
  }

  if (!('liked' in actor) || !actor.liked) {
    throw new Error('Bad actor: No `liked` collection.');
  }

  const likedId = getId(actor.liked);

  if (!likedId) {
    throw new Error('Bad liked collection: No ID.');
  }

  await Promise.all([this.adapters.db.insertOrderedItem(likedId, object.id)]);

  const isLocal = getCollectionNameByUrl(object.id) !== 'foreign-object';

  if (isLocal) {
    if (!('likes' in object) || !object.likes) {
      throw new Error('Object is local, but has no `likes` collection.');
    }

    const likesId = getId(object.likes);

    if (!likesId) {
      throw new Error('Bad likes collection: No ID.');
    }

    await Promise.all([
      this.adapters.db.insertOrderedItem(likesId, this.activity.id),
    ]);
  }
}
