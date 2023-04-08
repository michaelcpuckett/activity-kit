"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserActor = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
const path_to_regexp_1 = require("path-to-regexp");
async function createUserActor(user) {
    (0, activitypub_core_types_1.assertIsApActor)(user);
    const { publicKey, privateKey } = await this.adapters.crypto.generateKeyPair();
    const publishedDate = new Date();
    const getRouteUrl = (route, data) => new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(route, {
        validate: false,
    })(data)}`);
    const userId = getRouteUrl(this.routes[user.type.toLowerCase()], {
        username: user.preferredUsername,
    });
    const entityRoute = userId.pathname;
    const inboxId = getRouteUrl(this.routes.inbox, {
        entityRoute,
    });
    const userInbox = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: inboxId,
        url: inboxId,
        name: 'Inbox',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const outboxId = getRouteUrl(this.routes.outbox, {
        entityRoute,
    });
    const userOutbox = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: outboxId,
        url: outboxId,
        name: 'Outbox',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const followersId = getRouteUrl(this.routes.followers, {
        entityRoute,
    });
    const userFollowers = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: followersId,
        url: followersId,
        name: 'Followers',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const followingId = getRouteUrl(this.routes.following, {
        entityRoute,
    });
    const userFollowing = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: followingId,
        url: followingId,
        name: 'Following',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const likedId = getRouteUrl(this.routes.liked, {
        entityRoute,
    });
    const userLiked = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: likedId,
        url: likedId,
        name: 'Liked',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const sharedId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'shared',
    });
    const userShared = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: sharedId,
        url: sharedId,
        name: 'Shared',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const blocksId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'blocks',
    });
    const userBlocks = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: blocksId,
        url: blocksId,
        name: 'Blocks',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const userRequestsId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'requests',
    });
    const userRequests = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: userRequestsId,
        url: userRequestsId,
        name: 'Requests',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const userListsId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'lists',
    });
    const userLists = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: userListsId,
        url: userListsId,
        name: 'Lists',
        summary: 'A user\'s set of curated lists of other users, such as "Friends Only".',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const userBookmarksId = getRouteUrl(this.routes.stream, {
        entityRoute,
        slug: 'bookmarks',
    });
    const userBookmarks = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: userBookmarksId,
        url: userBookmarksId,
        name: 'Bookmarks',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const uploadMediaId = getRouteUrl(this.routes.endpoint, {
        entityRoute,
        slug: 'upload-media',
    });
    let userActor = {
        '@context': [
            activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
            activitypub_core_utilities_1.W3ID_SECURITY_CONTEXT,
            {
                PropertyValue: 'https://schema.org/PropertyValue',
                value: 'https://schema.org/value',
            },
        ],
        id: new URL(userId),
        url: new URL(userId),
        type: user.type === activitypub_core_types_1.AP.ActorTypes.GROUP
            ? activitypub_core_types_1.AP.ActorTypes.GROUP
            : activitypub_core_types_1.AP.ActorTypes.PERSON,
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
            sharedInbox: new URL(activitypub_core_utilities_1.SHARED_INBOX_ID),
            uploadMedia: uploadMediaId,
        },
        publicKey: {
            id: `${userId}#main-key`,
            owner: `${userId}`,
            publicKeyPem: publicKey,
        },
        published: publishedDate,
    };
    (0, activitypub_core_types_1.assertIsApActor)(userActor);
    const botActor = await this.adapters.db.findOne('entity', {
        preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
    });
    (0, activitypub_core_types_1.assertIsApActor)(botActor);
    const createActorActivityId = getRouteUrl(this.routes.create, {
        guid: await this.adapters.crypto.randomBytes(16),
    });
    const createActorActivity = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: createActorActivityId,
        url: createActorActivityId,
        type: activitypub_core_types_1.AP.ActivityTypes.CREATE,
        actor: botActor,
        object: userActor,
        to: [new URL(activitypub_core_utilities_1.PUBLIC_ACTOR)],
        published: publishedDate,
    };
    const declaredStreams = [];
    if (this.plugins) {
        for (const plugin of this.plugins) {
            if ('handleCreateUserActor' in plugin) {
                const pluginActivity = await plugin.handleCreateUserActor.call({
                    activity: createActorActivity,
                });
                (0, activitypub_core_types_1.assertIsApActor)(pluginActivity.object);
                userActor = pluginActivity.object;
            }
            if ('declareUserActorStreams' in plugin) {
                const streamsNames = plugin.declareUserActorStreams() ?? [];
                await Promise.all(streamsNames.map(async (streamName) => {
                    const streamId = getRouteUrl(this.routes.stream, {
                        slug: streamName
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, ''),
                    });
                    userActor.streams.push(streamId);
                    declaredStreams.push(this.adapters.db.saveEntity({
                        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
                        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
                        totalItems: 0,
                        attributedTo: userId,
                        orderedItems: [],
                        published: publishedDate,
                        name: streamName,
                        id: streamId,
                        url: streamId,
                    }));
                }));
            }
        }
    }
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
    ]);
    await Promise.all(declaredStreams);
    if (createActorActivity.id && userInbox.id) {
        await Promise.all([
            this.adapters.db.insertOrderedItem(new URL(`${botActor.id}/outbox`), createActorActivity.id),
            this.adapters.db.insertOrderedItem(userInbox.id, createActorActivity.id),
        ]);
    }
    this.adapters.delivery.broadcast(createActorActivity, botActor);
}
exports.createUserActor = createUserActor;
//# sourceMappingURL=createUserActor.js.map