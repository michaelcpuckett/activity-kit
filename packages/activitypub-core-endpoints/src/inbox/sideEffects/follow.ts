import { AP } from 'activitypub-core-types';
import { isTypeOf } from 'activitypub-core-utilities';
import { getGuid } from 'activitypub-core-utilities';
import {
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
  PUBLIC_ACTOR,
} from 'activitypub-core-utilities';
import { getId } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '..';

export async function handleFollow(this: InboxPostEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.db.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (!isTypeOf(object, AP.ActorTypes)) {
    // Not applicable.
    return;
  }

  if (!('actor' in activity)) {
    throw new Error('Bad activity: no actor.');
  }

  const actorId = getId(activity.actor);

  if (!actorId) {
    throw new Error('Bad activity: No actor.');
  }

  const actor = await this.adapters.db.queryById(actorId);

  if (!actor) {
    throw new Error('Bad actor: Not found.');
  }

  if (!isTypeOf(actor, AP.ActorTypes)) {
    throw new Error('Bad actor: Type not recognized as an actor.');
  }

  const follower = actor;
  const followee = object;

  if (!(follower.id && followee.id)) {
    return;
  }

  const followersId = getId(followee.followers);

  if (!followersId) {
    throw new Error('Bad followee: No followers ID.');
  }

  const followers = await this.adapters.db.findEntityById(followersId);

  if (!followers) {
    throw new Error('Bad followers collection: Not found.');
  }

  // Already a follower.
  if (followers.items.map((id: URL) => id.toString()).includes(getId(follower).toString())) {
    console.log('NOTE: ALREADY A FOLLOWER.');
    return;
  }

  if (this.actor.manuallyApprovesFollowers) {
    const streams = await Promise.all(this.actor.streams.map(async stream => await this.adapters.db.fetchEntityById(stream)));

    const requests = streams.find((stream: AP.Collection) => {
      if (stream.name === 'Requests') {
        return true;
      }
    });

    if (!requests) {
      throw new Error('Bad Requests cllection: Not found.');
    }

    await this.adapters.db.insertItem(getId(requests), activity.id);

    return;
  }

  // Now we're in outbox, because this is auto-generated:

  const acceptActivityId = `${LOCAL_DOMAIN}/entity/${getGuid()}`;
  const publishedDate = new Date();

  const acceptActivityReplies: AP.Collection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${acceptActivityId}/replies`),
    url: new URL(`${acceptActivityId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  };

  const acceptActivityLikes = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${acceptActivityId}/likes`),
    url: new URL(`${acceptActivityId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const acceptActivityShares = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${acceptActivityId}/shares`),
    url: new URL(`${acceptActivityId}/shares`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const acceptActivity: AP.Accept = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(acceptActivityId),
    url: new URL(acceptActivityId),
    type: AP.ActivityTypes.ACCEPT,
    to: [new URL(PUBLIC_ACTOR), follower.id],
    actor: followee.id,
    object: activity.id,
    replies: acceptActivityReplies.id,
    likes: acceptActivityLikes.id,
    shares: acceptActivityShares.id,
    published: publishedDate,
  };

  const followeeOutboxId = getId(followee.outbox);

  if (!followeeOutboxId) {
    throw new Error('Bad followee: No outbox ID.');
  }

  await Promise.all([
    this.adapters.db.saveEntity(acceptActivity),
    this.adapters.db.saveEntity(acceptActivityReplies),
    this.adapters.db.saveEntity(acceptActivityLikes),
    this.adapters.db.saveEntity(acceptActivityShares),
    this.adapters.db.insertOrderedItem(followeeOutboxId, acceptActivity.id),
    this.adapters.db.insertItem(followersId, follower.id),
  ]);

  await this.adapters.delivery.broadcast(acceptActivity, followee);
}
