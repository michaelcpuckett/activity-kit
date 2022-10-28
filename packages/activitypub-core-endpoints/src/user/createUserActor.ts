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

  const id = `${LOCAL_DOMAIN}/actor/${user.preferredUsername}`;
  const publishedDate = new Date();

  const userInbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${id}/inbox`),
    url: new URL(`${id}/inbox`),
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
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

  const createActorActivityId = `${LOCAL_DOMAIN}/activity/${getGuid()}`;

  const createActorActivityReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createActorActivityId}/replies`),
    url: new URL(`${createActorActivityId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
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
    this.adapters.database.saveEntity(createActorActivity),
    this.adapters.database.saveEntity(createActorActivityReplies),
    this.adapters.database.saveEntity(createActorActivityLikes),
    this.adapters.database.saveEntity(createActorActivityShares),
    this.adapters.database.saveEntity(userActor),
    this.adapters.database.saveEntity(userInbox),
    this.adapters.database.saveEntity(userOutbox),
    this.adapters.database.saveEntity(userLiked),
    this.adapters.database.saveEntity(userReplies),
    this.adapters.database.saveEntity(userLikes),
    this.adapters.database.saveEntity(userShares),
    this.adapters.database.saveEntity(userFollowers),
    this.adapters.database.saveEntity(userFollowing),
    this.adapters.database.saveEntity(userShared),
    this.adapters.database.saveEntity(userBlocked),
    this.adapters.database.saveEntity(userGroups),
    this.adapters.database.saveEntity(userBookmarks),
    this.adapters.database.saveString('account', user.uid, user.email),
    this.adapters.database.saveString('private-key', user.uid, privateKey),
    this.adapters.database.saveString(
      'username',
      user.uid,
      user.preferredUsername,
    ),
  ]);

  const friendsGroupId = `${id}/groups/friends`;

  const friendsGroupInbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/inbox`),
    url: new URL(`${friendsGroupId}/inbox`),
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const friendsGroupOutbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/outbox`),
    url: new URL(`${friendsGroupId}/outbox`),
    name: 'Outbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const friendsGroupReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/likes`),
    url: new URL(`${friendsGroupId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const friendsGroupLikes: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/likes`),
    url: new URL(`${friendsGroupId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const friendsGroupShares: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/shares`),
    url: new URL(`${friendsGroupId}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const friendsGroupMembers: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${friendsGroupId}/members`),
    url: new URL(`${friendsGroupId}/members`),
    name: 'Members',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
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

  const createFriendsGroupActorActivityId = `${LOCAL_DOMAIN}/activity/${getGuid()}`;

  const createFriendsGroupActivityReplies: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createFriendsGroupActorActivityId}/replies`),
    url: new URL(`${createFriendsGroupActorActivityId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const createFriendsGroupActivityLikes: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createFriendsGroupActorActivityId}/likes`),
    url: new URL(`${createFriendsGroupActorActivityId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const createFriendsGroupActivityShares: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${createFriendsGroupActorActivityId}/shares`),
    url: new URL(`${createFriendsGroupActorActivityId}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
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
    this.adapters.database.saveEntity(friendsGroupActor),
    this.adapters.database.saveEntity(friendsGroupInbox),
    this.adapters.database.saveEntity(friendsGroupOutbox),
    this.adapters.database.saveEntity(friendsGroupReplies),
    this.adapters.database.saveEntity(friendsGroupLikes),
    this.adapters.database.saveEntity(friendsGroupShares),
    this.adapters.database.saveEntity(friendsGroupMembers),
    this.adapters.database.saveEntity(createFriendsGroupActorActivity),
    this.adapters.database.saveEntity(createFriendsGroupActivityReplies),
    this.adapters.database.saveEntity(createFriendsGroupActivityLikes),
    this.adapters.database.saveEntity(createFriendsGroupActivityShares),
  ]);

  if (userGroups.id) {
    await Promise.all([
      this.adapters.database.insertItem(userGroups.id, new URL(friendsGroupId)),
    ]);
  }

  if (createFriendsGroupActorActivity.id && friendsGroupInbox.id) {
    await Promise.all([
      this.adapters.database.insertOrderedItem(
        new URL(`${SERVER_ACTOR_ID}/outbox`),
        createFriendsGroupActorActivity.id,
      ),
      this.adapters.database.insertOrderedItem(
        friendsGroupInbox.id,
        createFriendsGroupActorActivity.id,
      ),
    ]);
  }

  if (createActorActivity.id && userInbox.id) {
    await Promise.all([
      this.adapters.database.insertOrderedItem(
        new URL(`${SERVER_ACTOR_ID}/outbox`),
        createActorActivity.id,
      ),
      this.adapters.database.insertOrderedItem(
        userInbox.id,
        createActorActivity.id,
      ),
    ]);
  }
}
