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
exports.createServerActor = void 0;
const utilities_1 = require("@activity-kit/utilities");
const AP = __importStar(require("@activity-kit/types"));
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
    const botInbox = (0, utilities_1.applyContext)({
        id: inboxId,
        url: inboxId,
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    });
    const outboxId = getRouteUrl(this.routes.serverOutbox, {
        entityRoute,
    });
    const botOutbox = (0, utilities_1.applyContext)({
        id: outboxId,
        url: outboxId,
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        orderedItems: [],
        published: publishedDate,
    });
    const followersId = getRouteUrl(this.routes.serverFollowers, {
        entityRoute,
    });
    const botFollowers = (0, utilities_1.applyContext)({
        id: followersId,
        url: followersId,
        name: 'Followers',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    });
    const followingId = getRouteUrl(this.routes.serverFollowing, {
        entityRoute,
    });
    const botFollowing = (0, utilities_1.applyContext)({
        id: followingId,
        url: followingId,
        name: 'Following',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    });
    const hashtagsId = getRouteUrl(this.routes.serverHashtags, {
        entityRoute,
    });
    const botHashtags = (0, utilities_1.applyContext)({
        id: hashtagsId,
        url: hashtagsId,
        name: 'Hashtags',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        attributedTo: userId,
        items: [],
        published: publishedDate,
    });
    const botActor = (0, utilities_1.applyContext)({
        id: userId,
        url: userId,
        type: AP.ActorTypes.APPLICATION,
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
    });
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