"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerActor = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function createServerActor() {
    const { publicKey: botPublicKey, privateKey: botPrivateKey } = await (0, activitypub_core_utilities_2.generateKeyPair)();
    const publishedDate = new Date();
    const compileOptions = { encode: encodeURIComponent };
    const getRouteUrl = (route, data) => new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(route, compileOptions)(data)}`);
    const userId = getRouteUrl(this.routes.application, {
        username: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
    });
    const entityRoute = userId.pathname;
    const inboxId = new URL(`${userId}/inbox`);
    const botInbox = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: inboxId,
        url: inboxId,
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const outboxId = new URL(`${userId}/outbox`);
    const botOutbox = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: outboxId,
        url: outboxId,
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const followersId = new URL(`${userId}/followers`);
    const botFollowers = {
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
    const followingId = new URL(`${userId}/following`);
    const botFollowing = {
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
    const botActor = {
        '@context': [activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT, activitypub_core_utilities_1.W3ID_SECURITY_CONTEXT],
        id: userId,
        url: userId,
        type: activitypub_core_types_1.AP.ActorTypes.APPLICATION,
        name: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
        preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
        inbox: botInbox.id,
        outbox: botOutbox.id,
        following: botFollowing.id,
        followers: botFollowers.id,
        endpoints: {
            sharedInbox: new URL(activitypub_core_utilities_1.SHARED_INBOX_ID),
        },
        publicKey: {
            id: `${userId}#main-key`,
            owner: `${userId}`,
            publicKeyPem: botPublicKey,
        },
        published: publishedDate,
    };
    await Promise.all([
        this.adapters.db.saveEntity(botActor),
        this.adapters.db.saveEntity(botInbox),
        this.adapters.db.saveEntity(botOutbox),
        this.adapters.db.saveEntity(botFollowing),
        this.adapters.db.saveEntity(botFollowers),
        this.adapters.db.saveString('username', 'bot', 'bot'),
        this.adapters.db.saveString('privateKey', 'bot', botPrivateKey),
    ]);
}
exports.createServerActor = createServerActor;
//# sourceMappingURL=createServerActor.js.map