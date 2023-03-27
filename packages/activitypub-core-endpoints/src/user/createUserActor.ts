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
import { AP } from 'activitypub-core-types';
import { UserPostEndpoint } from '.';

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
  const { publicKey, privateKey } = await generateKeyPair();

  let id = `${LOCAL_DOMAIN}/@${user.preferredUsername}`;

  if (this.plugins) {
    for (const plugin of this.plugins) {
      if (plugin.generateActorId) {
        id = plugin.generateActorId.call(this, user.preferredUsername);
      }
    }
  }

  let baseId = id;

  if (this.plugins) {
    for (const plugin of this.plugins) {
      if (plugin.generateActorBaseId) {
        baseId = plugin.generateActorBaseId.call(this, user.preferredUsername);
      }
    }
  }

  const publishedDate = new Date();

  const userInbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/inbox`),
    url: new URL(`${baseId}/inbox`),
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  let outboxId = `${baseId}/outbox`;

  if (this.plugins) {
    for (const plugin of this.plugins) {
      if (plugin.generateActorOutboxId) {
        outboxId = plugin.generateActorOutboxId.call(
          this,
          user.preferredUsername,
        );
      }
    }
  }

  const userOutbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(outboxId),
    url: new URL(outboxId),
    name: 'Outbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userFollowers: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/followers`),
    url: new URL(`${baseId}/followers`),
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userFollowing: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/following`),
    url: new URL(`${baseId}/following`),
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userLiked: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/liked`),
    url: new URL(`${baseId}/liked`),
    name: 'Liked',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userShared: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/shared`),
    url: new URL(`${baseId}/shared`),
    name: 'Shared',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userBlocks: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/blocks`),
    url: new URL(`${baseId}/blocks`),
    name: 'Blocks',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userRequests: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/requests`),
    url: new URL(`${baseId}/requests`),
    name: 'Requests',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userLists: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/lists`),
    url: new URL(`${baseId}/lists`),
    name: 'Lists',
    summary:
      'A user\'s set of curated lists of other users, such as "Friends Only".',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/replies`),
    url: new URL(`${baseId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userLikes: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/likes`),
    url: new URL(`${baseId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userShares: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/shares`),
    url: new URL(`${baseId}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userBookmarks: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${baseId}/bookmarks`),
    url: new URL(`${baseId}/bookmarks`),
    name: 'Bookmarks',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  if (
    !Object.values(AP.ActorTypes).includes(
      user.type as typeof AP.ActorTypes[keyof typeof AP.ActorTypes],
    )
  ) {
    throw new Error('Bad request: Provided type is not an Actor type.');
  }

  let userActor: AP.Actor = {
    '@context': [
      ACTIVITYSTREAMS_CONTEXT,
      W3ID_SECURITY_CONTEXT,
      {
        PropertyValue: 'https://schema.org/PropertyValue',
        value: 'https://schema.org/value',
      },
    ],
    id: new URL(id),
    url: new URL(id),
    type: user.type as typeof AP.ActorTypes[keyof typeof AP.ActorTypes],
    name: user.name,
    preferredUsername: user.preferredUsername,
    inbox: userInbox.id,
    outbox: userOutbox.id,
    followers: userFollowers.id,
    following: userFollowing.id,
    liked: userLiked.id,
    replies: userReplies.id,
    likes: userLikes.id,
    shares: userShares.id,
    streams: [
      userShared.id,
      userBlocks.id,
      userRequests.id,
      userLists.id,
      userBookmarks.id,
    ],
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
      uploadMedia: new URL(`${baseId}/uploadMedia`),
    },
    publicKey: {
      id: `${id}#main-key`,
      owner: id,
      publicKeyPem: publicKey,
    },
    published: publishedDate,
  } as AP.Actor;

  const createActorActivityId = `${LOCAL_DOMAIN}/entity/${getGuid()}`;

  const createActorActivityReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createActorActivityId}/replies`),
    url: new URL(`${createActorActivityId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
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
    attributedTo: new URL(id),
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
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  let createActorActivity: AP.Create = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(createActorActivityId),
    url: new URL(createActorActivityId),
    type: AP.ActivityTypes.CREATE,
    actor: new URL(SERVER_ACTOR_ID),
    object: userActor,
    to: [new URL(PUBLIC_ACTOR)],
    replies: createActorActivityReplies.id,
    likes: createActorActivityLikes.id,
    shares: createActorActivityShares.id,
    published: publishedDate,
  };

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

  await Promise.all([
    this.adapters.db.saveEntity(createActorActivity),
    this.adapters.db.saveEntity(createActorActivityReplies),
    this.adapters.db.saveEntity(createActorActivityLikes),
    this.adapters.db.saveEntity(createActorActivityShares),
    this.adapters.db.saveEntity(userActor),
    this.adapters.db.saveEntity(userInbox),
    this.adapters.db.saveEntity(userOutbox),
    this.adapters.db.saveEntity(userLiked),
    this.adapters.db.saveEntity(userReplies),
    this.adapters.db.saveEntity(userLikes),
    this.adapters.db.saveEntity(userShares),
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
    ...((): Array<Promise<unknown>> => {
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
                attributedTo: new URL(id),
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
    })(),
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
