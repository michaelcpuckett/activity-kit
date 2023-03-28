"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserActor = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
const path_to_regexp_1 = require("path-to-regexp");
async function createUserActor(user) {
    if (!Object.values(activitypub_core_types_1.AP.ActorTypes).includes(user.type)) {
        throw new Error('Bad request: Provided type is not an Actor type.');
    }
    const { publicKey, privateKey } = await (0, activitypub_core_utilities_2.generateKeyPair)();
    const publishedDate = new Date();
    const compileOptions = { encode: encodeURIComponent };
    const getRouteUrl = (route, data) => new URL(`${activitypub_core_utilities_3.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(route, compileOptions)(data)}`);
    const userId = getRouteUrl(this.routes.actor, {
        type: user.type.toLowerCase(),
        username: user.preferredUsername,
    });
    const inboxId = getRouteUrl(this.routes.inbox, {
        actorType: user.type.toLowerCase(),
        username: user.preferredUsername,
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
        actorType: user.type.toLowerCase(),
        username: user.preferredUsername,
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
        actorType: user.type.toLowerCase(),
        username: user.preferredUsername,
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
        actorType: user.type.toLowerCase(),
        username: user.preferredUsername,
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
        actorType: user.type.toLowerCase(),
        username: user.preferredUsername,
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
    const sharedId = getRouteUrl(this.routes.shared, {
        actorType: user.type.toLowerCase(),
        username: user.preferredUsername,
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
    const userBlocks = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(`${userId}/blocks`),
        url: new URL(`${userId}/blocks`),
        name: 'Blocks',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const uploadMediaId = getRouteUrl(this.routes.uploadMedia, {
        actorType: user.type.toLowerCase(),
        username: user.preferredUsername,
    });
    const userActor = {
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
        ],
        endpoints: {
            sharedInbox: new URL(activitypub_core_utilities_3.SHARED_INBOX_ID),
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
    const createActorActivityId = getRouteUrl(this.routes.activity, {
        actorType: user.type.toLowerCase(),
        username: user.preferredUsername,
        type: activitypub_core_types_1.AP.ActivityTypes.CREATE.toLowerCase(),
        id: (0, activitypub_core_utilities_1.getGuid)(),
    });
    const createActorActivityReplies = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(`${createActorActivityId}/replies`),
        url: new URL(`${createActorActivityId}/replies`),
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const createActorActivityLikes = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(`${createActorActivityId}/likes`),
        url: new URL(`${createActorActivityId}/likes`),
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const createActorActivityShares = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(`${createActorActivityId}/shares`),
        url: new URL(`${createActorActivityId}/shares`),
        name: 'Shares',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const createActorActivity = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: createActorActivityId,
        url: createActorActivityId,
        type: activitypub_core_types_1.AP.ActivityTypes.CREATE,
        actor: new URL(activitypub_core_utilities_3.SERVER_ACTOR_ID),
        object: userActor,
        to: [new URL(activitypub_core_utilities_1.PUBLIC_ACTOR)],
        replies: createActorActivityReplies.id,
        likes: createActorActivityLikes.id,
        shares: createActorActivityShares.id,
        published: publishedDate,
    };
    await Promise.all([
        this.adapters.db.saveEntity(createActorActivity),
        this.adapters.db.saveEntity(createActorActivityReplies),
        this.adapters.db.saveEntity(createActorActivityLikes),
        this.adapters.db.saveEntity(createActorActivityShares),
        this.adapters.db.saveEntity(userActor),
        this.adapters.db.saveEntity(userInbox),
        this.adapters.db.saveEntity(userOutbox),
        this.adapters.db.saveEntity(userLiked),
        this.adapters.db.saveEntity(userFollowers),
        this.adapters.db.saveEntity(userFollowing),
        this.adapters.db.saveEntity(userShared),
        this.adapters.db.saveEntity(userBlocks),
        this.adapters.db.saveString('account', user.uid, user.email),
        this.adapters.db.saveString('privateKey', user.uid, privateKey),
        this.adapters.db.saveString('username', user.uid, user.preferredUsername),
    ]);
    if (createActorActivity.id && userInbox.id) {
        await Promise.all([
            this.adapters.db.insertOrderedItem(new URL(`${activitypub_core_utilities_3.SERVER_ACTOR_ID}/outbox`), createActorActivity.id),
            this.adapters.db.insertOrderedItem(userInbox.id, createActorActivity.id),
        ]);
    }
    this.adapters.delivery.broadcast(createActorActivity, (await this.adapters.db.findOne('entity', {
        preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
    })));
}
exports.createUserActor = createUserActor;
//# sourceMappingURL=createUserActor.js.map