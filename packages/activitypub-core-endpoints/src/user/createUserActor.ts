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

  const getRouteUrl = (route: string, data: Record<string, string>) =>
    new URL(
      `${LOCAL_DOMAIN}${compile(route, {
        validate: false,
      })(data)}`,
    );

  const userId = getRouteUrl(this.routes[user.type.toLowerCase()], {
    username: user.preferredUsername,
  });

  const entityRoute = userId.pathname;

  const inboxId = getRouteUrl(this.routes.inbox, {
    entityRoute,
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
    entityRoute,
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
    entityRoute,
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
    entityRoute,
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
    entityRoute,
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

  const sharedId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'shared',
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

  const blocksId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'blocks',
  });

  const userBlocks: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: blocksId,
    url: blocksId,
    name: 'Blocks',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const userRequestsId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'requests',
  });

  const userRequests: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: userRequestsId,
    url: userRequestsId,
    name: 'Requests',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const userListsId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'lists',
  });

  const userLists: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: userListsId,
    url: userListsId,
    name: 'Lists',
    summary:
      'A user\'s set of curated lists of other users, such as "Friends Only".',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const userBookmarksId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'bookmarks',
  });

  const userBookmarks: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: userBookmarksId,
    url: userBookmarksId,
    name: 'Bookmarks',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const uploadMediaId = getRouteUrl(this.routes.endpoint, {
    entityRoute,
    slug: 'upload-media',
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
    streams: [
      userShared.id,
      userBlocks.id,
      userRequests.id,
      userLists.id,
      userBookmarks.id,
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

  const createActorActivityId = getRouteUrl(this.routes.create, {
    guid: getGuid(),
  });

  const createActorActivity: AP.Create = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: createActorActivityId,
    url: createActorActivityId,
    type: AP.ActivityTypes.CREATE,
    actor: new URL(SERVER_ACTOR_ID),
    object: userActor,
    to: [new URL(PUBLIC_ACTOR)],
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
    this.adapters.db.saveEntity(userActor),
    this.adapters.db.saveEntity(userInbox),
    this.adapters.db.saveEntity(userOutbox),
    this.adapters.db.saveEntity(userLiked),
    this.adapters.db.saveEntity(userFollowers),
    this.adapters.db.saveEntity(userFollowing),
    this.adapters.db.saveEntity(userShared),
    this.adapters.db.saveEntity(userRequests),
    this.adapters.db.saveEntity(userBlocks),
    this.adapters.db.saveEntity(userLists),
    this.adapters.db.saveEntity(userBookmarks),
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

  const botActor = await this.adapters.db.findOne('entity', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  });

  assertIsApActor(botActor);

  if (createActorActivity.id && userInbox.id) {
    await Promise.all([
      this.adapters.db.insertOrderedItem(
        new URL(`${botActor.id}/outbox`),
        createActorActivity.id,
      ),
      this.adapters.db.insertOrderedItem(userInbox.id, createActorActivity.id),
    ]);
  }

  // Broadcast to Fediverse.
  this.adapters.delivery.broadcast(createActorActivity, botActor);
}
