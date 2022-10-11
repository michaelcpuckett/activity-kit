import { getGuid } from 'activitypub-core-utilities';
import { generateKeyPair } from 'activitypub-core-utilities';
import { LOCAL_DOMAIN, SERVER_ACTOR_ID, SHARED_INBOX_ID } from 'activitypub-core-utilities';
import type { Database } from 'activitypub-core-types';
import { AP } from 'activitypub-core-types';

export async function createUserActor(
  databaseService: Database,
  user: { uid: string; email: string; name: string; preferredUsername: string },
) {
  const { publicKey, privateKey } = await generateKeyPair();

  const id = `${LOCAL_DOMAIN}/actor/${user.preferredUsername}`;

  const userInbox: AP.OrderedCollection = {
    id: new URL(`${id}/inbox`),
    url: new URL(`${id}/inbox`),
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const userOutbox: AP.OrderedCollection = {
    id: new URL(`${id}/outbox`),
    url: new URL(`${id}/outbox`),
    name: 'Outbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const userFollowers: AP.Collection = {
    id: new URL(`${id}/followers`),
    url: new URL(`${id}/followers`),
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const userFollowing: AP.Collection = {
    id: new URL(`${id}/following`),
    url: new URL(`${id}/following`),
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const userLiked: AP.OrderedCollection = {
    id: new URL(`${id}/liked`),
    url: new URL(`${id}/liked`),
    name: 'Liked',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const userShared: AP.OrderedCollection = {
    id: new URL(`${id}/shared`),
    url: new URL(`${id}/shared`),
    name: 'Shared',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const userBlocked: AP.Collection = {
    id: new URL(`${id}/blocked`),
    url: new URL(`${id}/blocked`),
    name: 'Blocked',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const userGroups: AP.Collection = {
    id: new URL(`${id}/groups`),
    url: new URL(`${id}/groups`),
    name: 'Groups',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const userLikes: AP.OrderedCollection = {
    id: new URL(`${id}/likes`),
    url: new URL(`${id}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const userShares: AP.OrderedCollection = {
    id: new URL(`${id}/shares`),
    url: new URL(`${id}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const userBookmarks: AP.OrderedCollection = {
    id: new URL(`${id}/bookmarks`),
    url: new URL(`${id}/bookmarks`),
    name: 'Bookmarks',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const userActor: AP.Actor = {
    id: new URL(id),
    url: new URL(id),
    type: AP.ActorTypes.PERSON,
    name: user.name,
    preferredUsername: user.preferredUsername,
    inbox: userInbox,
    outbox: userOutbox,
    published: new Date(),
    followers: userFollowers,
    following: userFollowing,
    liked: userLiked,
    likes: userLikes,
    shares: userShares,
    streams: [userShared, userBlocked, userGroups, userBookmarks],
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
    },
    publicKey: {
      id: `${id}#main-key`,
      owner: id,
      publicKeyPem: publicKey,
    },
  };

  const createActorActivityId = `${LOCAL_DOMAIN}/activity/${getGuid()}`;

  const createActorActivity: AP.Create = {
    id: new URL(createActorActivityId),
    url: new URL(createActorActivityId),
    type: AP.ActivityTypes.CREATE,
    actor: new URL(SERVER_ACTOR_ID),
    object: userActor,
  };

  await Promise.all([
    databaseService.saveEntity(createActorActivity),
    databaseService.saveEntity(userActor),
    databaseService.saveEntity(userInbox),
    databaseService.saveEntity(userOutbox),
    databaseService.saveEntity(userLiked),
    databaseService.saveEntity(userLikes),
    databaseService.saveEntity(userShares),
    databaseService.saveEntity(userFollowers),
    databaseService.saveEntity(userFollowing),
    databaseService.saveEntity(userShared),
    databaseService.saveEntity(userBlocked),
    databaseService.saveEntity(userGroups),
    databaseService.saveEntity(userBookmarks),
    databaseService.saveString('account', user.uid, user.email),
    databaseService.saveString('private-key', user.uid, privateKey),
    databaseService.saveString('username', user.uid, user.preferredUsername),
  ]);

  const friendsGroupId = `${id}/groups/friends`;

  const friendsGroupInbox: AP.OrderedCollection = {
    id: new URL(`${friendsGroupId}/inbox`),
    url: new URL(`${friendsGroupId}/inbox`),
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const friendsGroupOutbox: AP.OrderedCollection = {
    id: new URL(`${friendsGroupId}/outbox`),
    url: new URL(`${friendsGroupId}/outbox`),
    name: 'Outbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const friendsGroupLikes: AP.OrderedCollection = {
    id: new URL(`${friendsGroupId}/likes`),
    url: new URL(`${friendsGroupId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const friendsGroupShares: AP.OrderedCollection = {
    id: new URL(`${friendsGroupId}/shares`),
    url: new URL(`${friendsGroupId}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const friendsGroupMembers: AP.Collection = {
    id: new URL(`${friendsGroupId}/members`),
    url: new URL(`${friendsGroupId}/members`),
    name: 'Members',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const friendsGroupActor: AP.Actor = {
    id: new URL(friendsGroupId),
    url: new URL(friendsGroupId),
    type: AP.ActorTypes.GROUP,
    name: 'Friends',
    inbox: friendsGroupInbox,
    outbox: friendsGroupOutbox,
    published: new Date(),
    likes: friendsGroupLikes,
    shares: friendsGroupShares,
    streams: [
      friendsGroupMembers, // TODO. Or relationships instead of all this?
    ],
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
    },
  };

  const createFriendsGroupActorActivityId = `${LOCAL_DOMAIN}/activity/${getGuid()}`;

  const createFriendsGroupActorActivity: AP.Create = {
    id: new URL(createFriendsGroupActorActivityId),
    url: new URL(createFriendsGroupActorActivityId),
    type: AP.ActivityTypes.CREATE,
    actor: new URL(SERVER_ACTOR_ID),
    object: friendsGroupActor,
  };

  await Promise.all([
    databaseService.saveEntity(friendsGroupActor),
    databaseService.saveEntity(friendsGroupInbox),
    databaseService.saveEntity(friendsGroupOutbox),
    databaseService.saveEntity(friendsGroupLikes),
    databaseService.saveEntity(friendsGroupShares),
    databaseService.saveEntity(friendsGroupMembers),
    databaseService.saveEntity(createFriendsGroupActorActivity),
  ]);

  if (userGroups.id) {
    await Promise.all([
      databaseService.insertItem(userGroups.id, new URL(friendsGroupId)),
    ]);
  }

  if (createFriendsGroupActorActivity.id && friendsGroupInbox.id) {
    await Promise.all([
      databaseService.insertOrderedItem(
        new URL(`${SERVER_ACTOR_ID}/outbox`),
        createFriendsGroupActorActivity.id,
      ),
      databaseService.insertOrderedItem(
        friendsGroupInbox.id,
        createFriendsGroupActorActivity.id,
      ),
    ]);
  }

  if (createActorActivity.id && userInbox.id) {
    await Promise.all([
      databaseService.insertOrderedItem(
        new URL(`${SERVER_ACTOR_ID}/outbox`),
        createActorActivity.id,
      ),
      databaseService.insertOrderedItem(userInbox.id, createActorActivity.id),
    ]);
  }
}
