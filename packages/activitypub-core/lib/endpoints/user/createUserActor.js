"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserActor = void 0;
const getGuid_1 = require("../../utilities/getGuid");
const generateKeyPair_1 = require("../../utilities/generateKeyPair");
const globals_1 = require("../../globals");
const types_1 = require("../../types");
async function createUserActor(databaseService, user) {
    const { publicKey, privateKey } = await (0, generateKeyPair_1.generateKeyPair)();
    const id = `${globals_1.LOCAL_DOMAIN}/actor/${user.preferredUsername}`;
    const userInbox = {
        id: new URL(`${id}/inbox`),
        url: new URL(`${id}/inbox`),
        name: 'Inbox',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const userOutbox = {
        id: new URL(`${id}/outbox`),
        url: new URL(`${id}/outbox`),
        name: 'Outbox',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const userFollowers = {
        id: new URL(`${id}/followers`),
        url: new URL(`${id}/followers`),
        name: 'Followers',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
    };
    const userFollowing = {
        id: new URL(`${id}/following`),
        url: new URL(`${id}/following`),
        name: 'Following',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
    };
    const userLiked = {
        id: new URL(`${id}/liked`),
        url: new URL(`${id}/liked`),
        name: 'Liked',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const userShared = {
        id: new URL(`${id}/shared`),
        url: new URL(`${id}/shared`),
        name: 'Shared',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const userBlocked = {
        id: new URL(`${id}/blocked`),
        url: new URL(`${id}/blocked`),
        name: 'Blocked',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
    };
    const userGroups = {
        id: new URL(`${id}/groups`),
        url: new URL(`${id}/groups`),
        name: 'Groups',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
    };
    const userLikes = {
        id: new URL(`${id}/likes`),
        url: new URL(`${id}/likes`),
        name: 'Likes',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const userShares = {
        id: new URL(`${id}/shares`),
        url: new URL(`${id}/shares`),
        name: 'Shares',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const userBookmarks = {
        id: new URL(`${id}/bookmarks`),
        url: new URL(`${id}/bookmarks`),
        name: 'Bookmarks',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const userActor = {
        id: new URL(id),
        url: new URL(id),
        type: types_1.AP.ActorTypes.PERSON,
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
            sharedInbox: new URL(globals_1.SHARED_INBOX_ID),
        },
        publicKey: {
            id: `${id}#main-key`,
            owner: id,
            publicKeyPem: publicKey,
        },
    };
    const createActorActivityId = `${globals_1.LOCAL_DOMAIN}/activity/${(0, getGuid_1.getGuid)()}`;
    const createActorActivity = {
        id: new URL(createActorActivityId),
        url: new URL(createActorActivityId),
        type: types_1.AP.ActivityTypes.CREATE,
        actor: new URL(globals_1.SERVER_ACTOR_ID),
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
    const friendsGroupInbox = {
        id: new URL(`${friendsGroupId}/inbox`),
        url: new URL(`${friendsGroupId}/inbox`),
        name: 'Inbox',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const friendsGroupOutbox = {
        id: new URL(`${friendsGroupId}/outbox`),
        url: new URL(`${friendsGroupId}/outbox`),
        name: 'Outbox',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const friendsGroupLikes = {
        id: new URL(`${friendsGroupId}/likes`),
        url: new URL(`${friendsGroupId}/likes`),
        name: 'Likes',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const friendsGroupShares = {
        id: new URL(`${friendsGroupId}/shares`),
        url: new URL(`${friendsGroupId}/shares`),
        name: 'Shares',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const friendsGroupMembers = {
        id: new URL(`${friendsGroupId}/members`),
        url: new URL(`${friendsGroupId}/members`),
        name: 'Members',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
    };
    const friendsGroupActor = {
        id: new URL(friendsGroupId),
        url: new URL(friendsGroupId),
        type: types_1.AP.ActorTypes.GROUP,
        name: 'Friends',
        inbox: friendsGroupInbox,
        outbox: friendsGroupOutbox,
        published: new Date(),
        likes: friendsGroupLikes,
        shares: friendsGroupShares,
        streams: [
            friendsGroupMembers,
        ],
        endpoints: {
            sharedInbox: new URL(globals_1.SHARED_INBOX_ID),
        },
    };
    const createFriendsGroupActorActivityId = `${globals_1.LOCAL_DOMAIN}/activity/${(0, getGuid_1.getGuid)()}`;
    const createFriendsGroupActorActivity = {
        id: new URL(createFriendsGroupActorActivityId),
        url: new URL(createFriendsGroupActorActivityId),
        type: types_1.AP.ActivityTypes.CREATE,
        actor: new URL(globals_1.SERVER_ACTOR_ID),
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
            databaseService.insertOrderedItem(new URL(`${globals_1.SERVER_ACTOR_ID}/outbox`), createFriendsGroupActorActivity.id),
            databaseService.insertOrderedItem(friendsGroupInbox.id, createFriendsGroupActorActivity.id),
        ]);
    }
    if (createActorActivity.id && userInbox.id) {
        await Promise.all([
            databaseService.insertOrderedItem(new URL(`${globals_1.SERVER_ACTOR_ID}/outbox`), createActorActivity.id),
            databaseService.insertOrderedItem(userInbox.id, createActorActivity.id),
        ]);
    }
}
exports.createUserActor = createUserActor;
//# sourceMappingURL=createUserActor.js.map