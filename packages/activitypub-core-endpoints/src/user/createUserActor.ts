import {
  ACTIVITYSTREAMS_CONTEXT,
  getGuid,
  PUBLIC_ACTOR,
  SERVER_ACTOR_USERNAME,
  W3ID_SECURITY_CONTEXT,
} from 'activitypub-core-utilities';
import { generateKeyPair } from 'activitypub-core-utilities';
import {
  LOCAL_DOMAIN,
  SERVER_ACTOR_ID,
  SHARED_INBOX_ID,
} from 'activitypub-core-utilities';
import { AP, assertIsApActor } from 'activitypub-core-types';
import { UserPostEndpoint } from '.';
import { compile } from 'path-to-regexp';

export async function createUserActor(
  this: UserPostEndpoint,
  user: {
    uid: string;
    type: string;
    email: string;
    name: string;
    preferredUsername: string;
  },
) {
  if (
    !Object.values(AP.ActorTypes).includes(
      user.type as typeof AP.ActorTypes[keyof typeof AP.ActorTypes],
    )
  ) {
    throw new Error('Bad request: Provided type is not an Actor type.');
  }

  const { publicKey, privateKey } = await generateKeyPair();

  const publishedDate = new Date();

  const compileOptions = { encode: encodeURIComponent };

  const getRouteUrl = (route: string, data: Record<string, string>) =>
    new URL(`${LOCAL_DOMAIN}${compile(route, compileOptions)(data)}`);

  const userId = getRouteUrl(this.routes.actor, {
    type: user.type.toLowerCase(),
    username: user.preferredUsername,
  });

  const inboxId = getRouteUrl(this.routes.inbox, {
    actorType: user.type.toLowerCase(),
    username: user.preferredUsername,
  });

  const userInbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: inboxId,
    url: inboxId,
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const outboxId = getRouteUrl(this.routes.outbox, {
    actorType: user.type.toLowerCase(),
    username: user.preferredUsername,
  });

  const userOutbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: outboxId,
    url: outboxId,
    name: 'Outbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const followersId = getRouteUrl(this.routes.followers, {
    actorType: user.type.toLowerCase(),
    username: user.preferredUsername,
  });

  const userFollowers: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: followersId,
    url: followersId,
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const followingId = getRouteUrl(this.routes.following, {
    actorType: user.type.toLowerCase(),
    username: user.preferredUsername,
  });

  const userFollowing: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: followingId,
    url: followingId,
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const likedId = getRouteUrl(this.routes.liked, {
    actorType: user.type.toLowerCase(),
    username: user.preferredUsername,
  });

  const userLiked: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: likedId,
    url: likedId,
    name: 'Liked',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const sharedId = getRouteUrl(this.routes.shared, {
    actorType: user.type.toLowerCase(),
    username: user.preferredUsername,
  });

  const userShared: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: sharedId,
    url: sharedId,
    name: 'Shared',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  // TODO should this be "blocked"?
  const userBlocks: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${userId}/blocks`),
    url: new URL(`${userId}/blocks`),
    name: 'Blocks',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  /*const userRequests: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${userId}/requests`),
    url: new URL(`${userId}/requests`),
    name: 'Requests',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const userLists: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${userId}/lists`),
    url: new URL(`${userId}/lists`),
    name: 'Lists',
    summary:
      'A user\'s set of curated lists of other users, such as "Friends Only".',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const userReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${userId}/replies`),
    url: new URL(`${userId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const userLikes: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${userId}/likes`),
    url: new URL(`${userId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const userShares: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${userId}/shares`),
    url: new URL(`${userId}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const userBookmarks: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${userId}/bookmarks`),
    url: new URL(`${userId}/bookmarks`),
    name: 'Bookmarks',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };*/

  const uploadMediaId = getRouteUrl(this.routes.uploadMedia, {
    actorType: user.type.toLowerCase(),
    username: user.preferredUsername,
  });

  const userActor = {
    '@context': [
      ACTIVITYSTREAMS_CONTEXT,
      W3ID_SECURITY_CONTEXT,
      {
        PropertyValue: 'https://schema.org/PropertyValue',
        value: 'https://schema.org/value',
      },
    ],
    id: new URL(userId),
    url: new URL(userId),
    type: user.type,
    name: user.name,
    preferredUsername: user.preferredUsername,
    inbox: userInbox.id,
    outbox: userOutbox.id,
    followers: userFollowers.id,
    following: userFollowing.id,
    liked: userLiked.id,
    /*
    replies: userReplies.id,
    likes: userLikes.id,
    shares: userShares.id,
    */
    streams: [
      userShared.id,
      userBlocks.id,
      /*
      userRequests.id,
      userLists.id,
      userBookmarks.id,
      */
    ],
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
      uploadMedia: uploadMediaId,
    },
    publicKey: {
      id: `${userId}#main-key`,
      owner: `${userId}`,
      publicKeyPem: publicKey,
    },
    published: publishedDate,
  };

  assertIsApActor(userActor);

  const createActorActivityId = getRouteUrl(this.routes.activity, {
    actorType: user.type.toLowerCase(),
    username: user.preferredUsername,
    type: AP.ActivityTypes.CREATE.toLowerCase(),
    id: getGuid(),
  });

  const createActorActivityReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createActorActivityId}/replies`),
    url: new URL(`${createActorActivityId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const createActorActivityLikes: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createActorActivityId}/likes`),
    url: new URL(`${createActorActivityId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const createActorActivityShares: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createActorActivityId}/shares`),
    url: new URL(`${createActorActivityId}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const createActorActivity: AP.Create = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: createActorActivityId,
    url: createActorActivityId,
    type: AP.ActivityTypes.CREATE,
    actor: new URL(SERVER_ACTOR_ID),
    object: userActor,
    to: [new URL(PUBLIC_ACTOR)],
    replies: createActorActivityReplies.id,
    likes: createActorActivityLikes.id,
    shares: createActorActivityShares.id,
    published: publishedDate,
  };

  /*
  if (this.plugins) {
    for (const plugin of this.plugins) {
      if ('handleCreateUserActor' in plugin) {
        createActorActivity = await plugin.handleCreateUserActor.call({
          activity: createActorActivity,
        });
        userActor = createActorActivity.object as AP.Actor;
      }

      if ('declareUserActorStreams' in plugin) {
        userActor.streams = userActor.streams.concat(
          plugin.declareUserActorStreams(userActor).map((entity) => entity.id),
        );
      }
    }
  }
  */

  await Promise.all([
    this.adapters.db.saveEntity(createActorActivity),
    this.adapters.db.saveEntity(createActorActivityReplies),
    this.adapters.db.saveEntity(createActorActivityLikes),
    this.adapters.db.saveEntity(createActorActivityShares),
    this.adapters.db.saveEntity(userActor),
    this.adapters.db.saveEntity(userInbox),
    this.adapters.db.saveEntity(userOutbox),
    this.adapters.db.saveEntity(userLiked),
    /*
    this.adapters.db.saveEntity(userReplies),
    this.adapters.db.saveEntity(userLikes),
    this.adapters.db.saveEntity(userShares),
    */
    this.adapters.db.saveEntity(userFollowers),
    this.adapters.db.saveEntity(userFollowing),
    this.adapters.db.saveEntity(userShared),
    //this.adapters.db.saveEntity(userRequests),
    this.adapters.db.saveEntity(userBlocks),
    //this.adapters.db.saveEntity(userLists),
    //this.adapters.db.saveEntity(userBookmarks),
    this.adapters.db.saveString('account', user.uid, user.email),
    this.adapters.db.saveString('privateKey', user.uid, privateKey),
    this.adapters.db.saveString('username', user.uid, user.preferredUsername),
    /*...((): Array<Promise<unknown>> => {
      if (!this.plugins) {
        return [];
      }

      const entitiesToSave: Array<Promise<void>> = [];
      for (const plugin of this.plugins) {
        if ('declareUserActorStreams' in plugin) {
          const streams: Array<{
            id: URL;
            url: URL;
            name: string;
          }> = plugin.declareUserActorStreams(userActor) ?? [];

          streams
            .map((stream) =>
              this.adapters.db.saveEntity({
                '@context': ACTIVITYSTREAMS_CONTEXT,
                type: AP.CollectionTypes.ORDERED_COLLECTION,
                totalItems: 0,
                attributedTo: userId,
                orderedItems: [],
                published: publishedDate,
                ...stream,
              }),
            )
            .forEach((stream) => {
              entitiesToSave.push(stream);
            });
        }
      }
      return entitiesToSave;
    })(),*/
  ]);

  if (createActorActivity.id && userInbox.id) {
    await Promise.all([
      this.adapters.db.insertOrderedItem(
        new URL(`${SERVER_ACTOR_ID}/outbox`),
        createActorActivity.id,
      ),
      this.adapters.db.insertOrderedItem(userInbox.id, createActorActivity.id),
    ]);
  }

  // Broadcast to Fediverse.
  this.adapters.delivery.broadcast(
    createActorActivity,
    (await this.adapters.db.findOne('entity', {
      preferredUsername: SERVER_ACTOR_USERNAME,
    })) as AP.Actor,
  );
}
