import { ACTIVITYSTREAMS_CONTEXT, getGuid } from 'activitypub-core-utilities';
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
    preferredUsername: string
  },
) {
  const { publicKey, privateKey } = await generateKeyPair();

  let id = `${LOCAL_DOMAIN}/@${user.preferredUsername}`;

  if (this.plugins) {
    for (const plugin of this.plugins) {
      if (plugin.generateActorId) {
        id = plugin.generateActorId(this.adapters)(user.preferredUsername);
      }
    }
  }

  const publishedDate = new Date();

  const userInbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/inbox`),
    url: new URL(`${id}/inbox`),
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userOutbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/outbox`),
    url: new URL(`${id}/outbox`),
    name: 'Outbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userFollowers: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/followers`),
    url: new URL(`${id}/followers`),
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userFollowing: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/following`),
    url: new URL(`${id}/following`),
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userLiked: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/liked`),
    url: new URL(`${id}/liked`),
    name: 'Liked',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userShared: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/shared`),
    url: new URL(`${id}/shared`),
    name: 'Shared',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userBlocked: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/blocked`),
    url: new URL(`${id}/blocked`),
    name: 'Blocked',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userLists: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/lists`),
    url: new URL(`${id}/lists`),
    name: 'Lists',
    summary: 'A user\'s set of curated lists of other users, such as "Friends Only".',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/replies`),
    url: new URL(`${id}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
    published: publishedDate,
  };

  const userLikes: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/likes`),
    url: new URL(`${id}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userShares: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/shares`),
    url: new URL(`${id}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  const userBookmarks: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/bookmarks`),
    url: new URL(`${id}/bookmarks`),
    name: 'Bookmarks',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
    published: publishedDate,
  };

  if (!Object.values(AP.ActorTypes).includes(user.type as typeof AP.ActorTypes[keyof typeof AP.ActorTypes])) {
    throw new Error('Bad request: Provided type is not an Actor type.')
  }

  let userActor: AP.Actor = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(id),
    url: new URL(id),
    type: [user.type] as typeof AP.ActorTypes[keyof typeof AP.ActorTypes][],
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
      userBlocked.id,
      userLists.id,
      userBookmarks.id
    ],
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
      uploadMedia: new URL(`${id}/uploadMedia`),
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
    this.adapters.db.saveEntity(userBlocked),
    this.adapters.db.saveEntity(userLists),
    this.adapters.db.saveEntity(userBookmarks),
    this.adapters.db.saveString('account', user.uid, user.email),
    this.adapters.db.saveString('private-key', user.uid, privateKey),
    this.adapters.db.saveString('username', user.uid, user.preferredUsername),
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
}
