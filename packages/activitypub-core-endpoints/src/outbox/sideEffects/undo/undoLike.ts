import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { OutboxPostHandler } from '../..';

export async function handleUndoLike(this: OutboxPostHandler, activity: AP.Entity) {
  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  if (!activity.id) {
    throw new Error('Bad activity: no ID.');
  }

  const actorId = getId((activity as AP.Activity).actor);

  if (!actorId) {
    throw new Error('Bad actor: no ID.');
  }

  const actor = await this.databaseService.queryById(actorId);

  if (!actor || !('outbox' in actor)) {
    throw new Error('Bad actor: not found.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.databaseService.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (!('likes' in object) || !object.likes) {
    throw new Error('Bad object: no `likes` collection.');
  }

  const likesId = getId(object.likes);

  if (!likesId) {
    throw new Error('Bad likes collection: no ID.');
  }

  if (!('liked' in actor) || !actor.liked) {
    throw new Error('Bad actor: No liked collection.');
  }

  const likedId = getId(actor.liked);

  if (!likedId) {
    throw new Error('Bad liked collection: no ID');
  }

  await Promise.all([
    this.databaseService.removeOrderedItem(likesId, activity.id),
    this.databaseService.removeOrderedItem(likedId, object.id),
  ]);
}
