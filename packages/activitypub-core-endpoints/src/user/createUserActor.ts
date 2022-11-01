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
  user: { uid: string; email: string; name: string; preferredUsername: string },
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

  const userGroups: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/groups`),
    url: new URL(`${id}/groups`),
    name: 'Groups',
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

  let userActor: AP.Actor = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(id),
    url: new URL(id),
    type: AP.ActorTypes.PERSON,
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
    streams: [userShared.id, userBlocked.id, userGroups.id, userBookmarks.id],
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
  };

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
    this.adapters.db.saveEntity(userGroups),
    this.adapters.db.saveEntity(userBookmarks),
    this.adapters.db.saveString('account', user.uid, user.email),
    this.adapters.db.saveString('private-key', user.uid, privateKey),
    this.adapters.db.saveString('username', user.uid, user.preferredUsername),
  ]);

  const friendsGroupId = `${id}/groups/friends`;

  const friendsGroupInbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/inbox`),
    url: new URL(`${friendsGroupId}/inbox`),
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
  };

  const friendsGroupOutbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/outbox`),
    url: new URL(`${friendsGroupId}/outbox`),
    name: 'Outbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
  };

  const friendsGroupReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/likes`),
    url: new URL(`${friendsGroupId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
  };

  const friendsGroupLikes: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/likes`),
    url: new URL(`${friendsGroupId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
  };

  const friendsGroupShares: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/shares`),
    url: new URL(`${friendsGroupId}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
  };

  const friendsGroupMembers: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/members`),
    url: new URL(`${friendsGroupId}/members`),
    name: 'Members',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
  };

  const friendsGroupActor: AP.Actor = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(friendsGroupId),
    url: new URL(friendsGroupId),
    type: AP.ActorTypes.GROUP,
    name: 'Friends',
    inbox: friendsGroupInbox.id,
    outbox: friendsGroupOutbox.id,
    published: new Date(),
    replies: friendsGroupReplies.id,
    likes: friendsGroupLikes.id,
    shares: friendsGroupShares.id,
    streams: [
      friendsGroupMembers.id, // TODO. Or relationships instead of all this?
    ],
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
    },
  };

  const createFriendsGroupActorActivityId = `${LOCAL_DOMAIN}/entity/${getGuid()}`;

  const createFriendsGroupActivityReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createFriendsGroupActorActivityId}/replies`),
    url: new URL(`${createFriendsGroupActorActivityId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    items: [],
  };

  const createFriendsGroupActivityLikes: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createFriendsGroupActorActivityId}/likes`),
    url: new URL(`${createFriendsGroupActorActivityId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
  };

  const createFriendsGroupActivityShares: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createFriendsGroupActorActivityId}/shares`),
    url: new URL(`${createFriendsGroupActorActivityId}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(id),
    orderedItems: [],
  };

  const createFriendsGroupActorActivity: AP.Create = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(createFriendsGroupActorActivityId),
    url: new URL(createFriendsGroupActorActivityId),
    type: AP.ActivityTypes.CREATE,
    actor: new URL(SERVER_ACTOR_ID),
    object: friendsGroupActor,
  };

  await Promise.all([
    this.adapters.db.saveEntity(friendsGroupActor),
    this.adapters.db.saveEntity(friendsGroupInbox),
    this.adapters.db.saveEntity(friendsGroupOutbox),
    this.adapters.db.saveEntity(friendsGroupReplies),
    this.adapters.db.saveEntity(friendsGroupLikes),
    this.adapters.db.saveEntity(friendsGroupShares),
    this.adapters.db.saveEntity(friendsGroupMembers),
    this.adapters.db.saveEntity(createFriendsGroupActorActivity),
    this.adapters.db.saveEntity(createFriendsGroupActivityReplies),
    this.adapters.db.saveEntity(createFriendsGroupActivityLikes),
    this.adapters.db.saveEntity(createFriendsGroupActivityShares),
  ]);

  if (userGroups.id) {
    await Promise.all([
      this.adapters.db.insertItem(userGroups.id, new URL(friendsGroupId)),
    ]);
  }

  if (createFriendsGroupActorActivity.id && friendsGroupInbox.id) {
    await Promise.all([
      this.adapters.db.insertOrderedItem(
        new URL(`${SERVER_ACTOR_ID}/outbox`),
        createFriendsGroupActorActivity.id,
      ),
      this.adapters.db.insertOrderedItem(
        friendsGroupInbox.id,
        createFriendsGroupActorActivity.id,
      ),
    ]);
  }

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
