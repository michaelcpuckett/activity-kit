"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerActor = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
const path_to_regexp_1 = require("path-to-regexp");
async function createServerActor() {
    const { publicKey: botPublicKey, privateKey: botPrivateKey } = await this.layers.auth.generateKeyPair();
    const publishedDate = new Date();
    const getRouteUrl = (route, routeData) => new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(route, {
        validate: false,
    })(routeData)}`);
    const userId = getRouteUrl(this.routes.serverActor, {
        username: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
    });
    const entityRoute = userId.pathname;
    const inboxId = getRouteUrl(this.routes.serverInbox, {
        entityRoute,
    });
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
    const outboxId = getRouteUrl(this.routes.serverOutbox, {
        entityRoute,
    });
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
    const followersId = getRouteUrl(this.routes.serverFollowers, {
        entityRoute,
    });
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
    const followingId = getRouteUrl(this.routes.serverFollowing, {
        entityRoute,
    });
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
    const hashtagsId = getRouteUrl(this.routes.serverHashtags, {
        entityRoute,
    });
    const botHashtags = {
        '@context': activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: hashtagsId,
        url: hashtagsId,
        name: 'Hashtags',
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
        streams: [botHashtags.id],
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
        this.layers.data.saveEntity(botActor),
        this.layers.data.saveEntity(botInbox),
        this.layers.data.saveEntity(botOutbox),
        this.layers.data.saveEntity(botFollowing),
        this.layers.data.saveEntity(botFollowers),
        this.layers.data.saveEntity(botHashtags),
        this.layers.data.saveString('username', 'bot', 'bot'),
        this.layers.data.saveString('privateKey', 'bot', botPrivateKey),
    ]);
}
exports.createServerActor = createServerActor;
//# sourceMappingURL=createServerActor.js.map