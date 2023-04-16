"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerActor = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
const path_to_regexp_1 = require("path-to-regexp");
async function createServerActor() {
    const { publicKey: botPublicKey, privateKey: botPrivateKey } = await this.core.generateKeyPair();
    const publishedDate = new Date();
    const getRouteUrl = (route, routeData) => new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(route, {
        validate: false,
    })(routeData)}`);
    const userId = getRouteUrl(this.routes.serverActor, {
        username: utilities_1.SERVER_ACTOR_USERNAME,
    });
    const entityRoute = userId.pathname;
    const inboxId = getRouteUrl(this.routes.serverInbox, {
        entityRoute,
    });
    const botInbox = {
        '@context': utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: inboxId,
        url: inboxId,
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const outboxId = getRouteUrl(this.routes.serverOutbox, {
        entityRoute,
    });
    const botOutbox = {
        '@context': utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: outboxId,
        url: outboxId,
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    };
    const followersId = getRouteUrl(this.routes.serverFollowers, {
        entityRoute,
    });
    const botFollowers = {
        '@context': utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: followersId,
        url: followersId,
        name: 'Followers',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const followingId = getRouteUrl(this.routes.serverFollowing, {
        entityRoute,
    });
    const botFollowing = {
        '@context': utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: followingId,
        url: followingId,
        name: 'Following',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const hashtagsId = getRouteUrl(this.routes.serverHashtags, {
        entityRoute,
    });
    const botHashtags = {
        '@context': utilities_1.ACTIVITYSTREAMS_CONTEXT,
        id: hashtagsId,
        url: hashtagsId,
        name: 'Hashtags',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    };
    const botActor = {
        '@context': [utilities_1.ACTIVITYSTREAMS_CONTEXT, utilities_1.W3ID_SECURITY_CONTEXT],
        id: userId,
        url: userId,
        type: types_1.AP.ActorTypes.APPLICATION,
        name: utilities_1.SERVER_ACTOR_USERNAME,
        preferredUsername: utilities_1.SERVER_ACTOR_USERNAME,
        inbox: botInbox.id,
        outbox: botOutbox.id,
        following: botFollowing.id,
        followers: botFollowers.id,
        streams: [botHashtags.id],
        endpoints: {
            sharedInbox: new URL(utilities_1.SHARED_INBOX_ID),
        },
        publicKey: {
            id: `${userId}#main-key`,
            owner: `${userId}`,
            publicKeyPem: botPublicKey,
        },
        published: publishedDate,
    };
    await Promise.all([
        this.core.saveEntity(botActor),
        this.core.saveEntity(botInbox),
        this.core.saveEntity(botOutbox),
        this.core.saveEntity(botFollowing),
        this.core.saveEntity(botFollowers),
        this.core.saveEntity(botHashtags),
        this.core.saveString('username', 'bot', 'bot'),
        this.core.saveString('privateKey', 'bot', botPrivateKey),
    ]);
}
exports.createServerActor = createServerActor;
//# sourceMappingURL=createServerActor.js.map