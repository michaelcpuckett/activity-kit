import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT, getGuid, getId, isType, LOCAL_DOMAIN, PUBLIC_ACTOR, getCollectionNameByUrl } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '..';

export async function handleCreate(this: InboxPostEndpoint) {
  const activity = this.activity as AP.Activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const object = activity.object;

  if ('inReplyTo' in object && object.inReplyTo) {
    const objectInReplyTo = await this.adapters.db.findEntityById(
      getId(object.inReplyTo),
    );

    if (objectInReplyTo) {
      const repliesCollectionId = getId(objectInReplyTo.replies);

      if (repliesCollectionId) {
        await this.adapters.db.insertOrderedItem(
          repliesCollectionId,
          object.id,
        );
      }
    }
  }

  // Groups automatically announce activities addressed to them if sent from non-blocked followers.
  if (isType(this.actor, AP.ActorTypes.GROUP)) {
    const followersCollection: AP.Collection = await this.adapters.db.findEntityById(getId(this.actor.followers));

    if (!followersCollection) {
      throw new Error('Bad following collection: not found.');
    }

    if (!Array.isArray(followersCollection.items)) {
      throw new Error('Bad following collection: no items.');
    }

    if (!followersCollection.items.map(id => id.toString()).includes(getId(activity.actor).toString())) {
      return;
    }

    // We're in outbox, because this is auto-generated:

    const publishedDate = new Date();
    const announceActivityId = `${LOCAL_DOMAIN}/entity/${getGuid()}`;
    
    if (
      !('streams' in this.actor) ||
      !this.actor.streams ||
      !Array.isArray(this.actor.streams)
    ) {
      throw new Error("Actor's streams not found.");
    }

    const streams = await Promise.all(
      this.actor.streams
        .map((stream: AP.Entity | URL) =>
          stream instanceof URL ? stream : stream.id,
        )
        .map(async (id: URL) =>
          id ? await this.adapters.db.findEntityById(id) : null,
        ),
    );

    const shared = streams.find((stream) => {
      if (stream && 'name' in stream) {
        if (stream.name === 'Shared') {
          return true;
        }
      }
    });

    if (!shared || !shared.id) {
      throw new Error('Bad shared collection: not found.');
    }

    // If this in reply to something, the member probably
    // meant to boost the post being replied to.

    const objectToAnnounce = await (async () => {
      if (!('inReplyTo' in object && object.inReplyTo)) {
        return object;
      }
  
      const objectInReplyToId = getId(object.inReplyTo);
  
      // Ensure the reply isn't something that's already been shared.
  
      if (shared.orderedItems.map(orderedItem => getId(orderedItem).toString()).includes(objectInReplyToId.toString())) {
        return object;
      }
  
      const objectInReplyTo = await this.adapters.db.queryById(
        objectInReplyToId
      );
  
      if (!objectInReplyTo) {
        return object;
      } 
  
      return objectInReplyTo;
    })();

    const announceActivityReplies: AP.Collection = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(`${announceActivityId}/replies`),
      url: new URL(`${announceActivityId}/replies`),
      name: 'Replies',
      type: AP.CollectionTypes.COLLECTION,
      totalItems: 0,
      items: [],
      published: publishedDate,
    };

    const announceActivityLikes = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(`${announceActivityId}/likes`),
      url: new URL(`${announceActivityId}/likes`),
      name: 'Likes',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
    };

    const announceActivityShares = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(`${announceActivityId}/shares`),
      url: new URL(`${announceActivityId}/shares`),
      name: 'Shares',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
    };

    const announceActivity: AP.Announce = {
      id: new URL(announceActivityId),
      url: new URL(announceActivityId),
      type: AP.ActivityTypes.ANNOUNCE,
      actor: getId(this.actor),
      to: [new URL(PUBLIC_ACTOR), getId(this.actor.followers)],
      object: getId(objectToAnnounce),
      replies: announceActivityReplies.id,
      likes: announceActivityLikes.id,
      shares: announceActivityShares.id,
      published: publishedDate,
    };

    await Promise.all([this.adapters.db.insertOrderedItem(shared.id, getId(objectToAnnounce))]);

    const isLocal = getCollectionNameByUrl(getId(objectToAnnounce)) !== 'foreign-entity';

    if (isLocal) {
      if (!('shares' in objectToAnnounce) || !objectToAnnounce.shares) {
        throw new Error('Object is local, but `shares` is not in this object.');
      }

      const sharesId = getId(objectToAnnounce.shares);

      if (!sharesId) {
        throw new Error('Bad shares collection: no ID.');
      }

      await Promise.all([
        this.adapters.db.insertOrderedItem(sharesId, announceActivityId),
      ]);
    }

    await Promise.all([
      this.adapters.db.saveEntity(announceActivity),
      this.adapters.db.saveEntity(announceActivityReplies),
      this.adapters.db.saveEntity(announceActivityLikes),
      this.adapters.db.saveEntity(announceActivityShares),
      this.adapters.db.insertOrderedItem(getId(this.actor.outbox), announceActivityId),
    ]);

    await this.adapters.delivery.broadcast(announceActivity, this.actor);
  }
}
