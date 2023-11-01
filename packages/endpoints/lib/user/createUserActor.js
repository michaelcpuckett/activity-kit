"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserActor = void 0;
const utilities_1 = require("@activity-kit/utilities");
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function createUserActor(user, uid) {
    type_utilities_1.assert.isApActor(user);
    const { publicKey, privateKey } = await this.core.generateKeyPair();
    const publishedDate = new Date();
    const getRouteUrl = (route, data) => new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(route, {
        validate: false,
    })(data)}`);
    const firstType = (Array.isArray(user.type) ? user.type[0] : user.type).toLowerCase();
    const userId = getRouteUrl(this.routes[firstType], {
        username: user.preferredUsername,
    });
    const entityRoute = userId.pathname;
    const inboxId = getRouteUrl(this.routes.inbox, {
        entityRoute,
    });
    const userInbox = (0, utilities_1.applyContext)({
        id: inboxId,
        url: inboxId,
        name: 'Inbox',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    });
    const outboxId = getRouteUrl(this.routes.outbox, {
        entityRoute,
    });
    const userOutbox = (0, utilities_1.applyContext)({
        id: outboxId,
        url: outboxId,
        name: 'Outbox',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    });
    const followersId = getRouteUrl(this.routes.followers, {
        entityRoute,
    });
    const userFollowers = (0, utilities_1.applyContext)({
        id: followersId,
        url: followersId,
        name: 'Followers',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    });
    const followingId = getRouteUrl(this.routes.following, {
        entityRoute,
    });
    const userFollowing = (0, utilities_1.applyContext)({
        id: followingId,
        url: followingId,
        name: 'Following',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    });
    const likedId = getRouteUrl(this.routes.liked, {
        entityRoute,
    });
    const userLiked = (0, utilities_1.applyContext)({
        id: likedId,
        url: likedId,
        name: 'Liked',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    });
    const sharedId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'shared',
    });
    const userShared = (0, utilities_1.applyContext)({
        id: sharedId,
        url: sharedId,
        name: 'Shared',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    });
    const blocksId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'blocks',
    });
    const userBlocks = (0, utilities_1.applyContext)({
        id: blocksId,
        url: blocksId,
        name: 'Blocks',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    });
    const userRequestsId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'requests',
    });
    const userRequests = (0, utilities_1.applyContext)({
        id: userRequestsId,
        url: userRequestsId,
        name: 'Requests',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    });
    const userListsId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'lists',
    });
    const userLists = (0, utilities_1.applyContext)({
        id: userListsId,
        url: userListsId,
        name: 'Lists',
        summary: 'A user\'s set of curated lists of other users, such as "Friends Only".',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    });
    const userBookmarksId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'bookmarks',
    });
    const userBookmarks = (0, utilities_1.applyContext)({
        id: userBookmarksId,
        url: userBookmarksId,
        name: 'Bookmarks',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    });
    const uploadMediaId = getRouteUrl(this.routes.endpoint, {
        entityRoute,
        slug: 'upload-media',
    });
    const userActorProperties = {
        id: userId,
        url: userId,
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
            sharedInbox: new URL(utilities_1.SHARED_INBOX_ID),
            uploadMedia: uploadMediaId,
        },
        publicKey: {
            id: `${userId}#main-key`,
            owner: `${userId}`,
            publicKeyPem: publicKey,
        },
        published: publishedDate,
    };
    let userActor = (0, utilities_1.applyContext)(user.type === AP.ActorTypes.GROUP
        ? {
            ...userActorProperties,
            type: AP.ActorTypes.GROUP,
        }
        : {
            ...userActorProperties,
            type: AP.ActorTypes.PERSON,
        });
    type_utilities_1.assert.isApActor(userActor);
    const botActor = await this.core.findOne('entity', {
        preferredUsername: utilities_1.SERVER_ACTOR_USERNAME,
    });
    type_utilities_1.assert.isApActor(botActor);
    const createActorActivityId = getRouteUrl(this.routes.create, {
        guid: await this.core.getGuid(),
    });
    const createActorActivity = (0, utilities_1.applyContext)({
        id: createActorActivityId,
        url: createActorActivityId,
        type: AP.ActivityTypes.CREATE,
        actor: botActor,
        object: userActor,
        to: [new URL(utilities_1.PUBLIC_ACTOR)],
        published: publishedDate,
    });
    const declaredStreams = [];
    if (this.plugins) {
        for (const plugin of this.plugins) {
            if ('handleCreateUserActor' in plugin) {
                const pluginActivity = await plugin.handleCreateUserActor.call({
                    activity: createActorActivity,
                    core: this.core,
                });
                type_utilities_1.assert.isApActor(pluginActivity.object);
                userActor = pluginActivity.object;
            }
            if ('declareUserActorStreams' in plugin) {
                const streamsNames = plugin.declareUserActorStreams() ?? [];
                await Promise.all(streamsNames.map(async (streamName) => {
                    const streamId = getRouteUrl(this.routes.stream, {
                        entityRoute,
                        slug: streamName
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, ''),
                    });
                    userActor.streams.push(streamId);
                    declaredStreams.push(this.core.saveEntity((0, utilities_1.applyContext)({
                        type: AP.CollectionTypes.ORDERED_COLLECTION,
                        totalItems: 0,
                        attributedTo: userId,
                        orderedItems: [],
                        published: publishedDate,
                        name: streamName,
                        id: streamId,
                        url: streamId,
                    })));
                }));
            }
        }
    }
    await Promise.all([
        this.core.saveEntity(createActorActivity),
        this.core.saveEntity(userActor),
        this.core.saveEntity(userInbox),
        this.core.saveEntity(userOutbox),
        this.core.saveEntity(userLiked),
        this.core.saveEntity(userFollowers),
        this.core.saveEntity(userFollowing),
        this.core.saveEntity(userShared),
        this.core.saveEntity(userRequests),
        this.core.saveEntity(userBlocks),
        this.core.saveEntity(userLists),
        this.core.saveEntity(userBookmarks),
        this.core.saveString('account', uid, user.email),
        this.core.saveString('privateKey', uid, privateKey),
        this.core.saveString('username', uid, user.preferredUsername),
    ]);
    await Promise.all(declaredStreams);
    if (createActorActivity.id && userInbox.id) {
        await Promise.all([
            this.core.insertOrderedItem((0, utilities_1.getId)(botActor.outbox), createActorActivity.id),
            this.core.insertOrderedItem(userInbox.id, createActorActivity.id),
        ]);
    }
    // Broadcast to Fediverse.
    this.core.broadcast(createActorActivity, botActor);
}
exports.createUserActor = createUserActor;
//# sourceMappingURL=createUserActor.js.map