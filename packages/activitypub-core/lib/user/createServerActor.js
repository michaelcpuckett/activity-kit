"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerActor = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
async function createServerActor(databaseService) {
    const { publicKey: botPublicKey, privateKey: botPrivateKey } = await (0, activitypub_core_utilities_2.generateKeyPair)();
    const botInbox = {
        id: new URL(`${activitypub_core_utilities_1.SERVER_ACTOR_ID}/inbox`),
        url: new URL(`${activitypub_core_utilities_1.SERVER_ACTOR_ID}/inbox`),
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const botOutbox = {
        id: new URL(`${activitypub_core_utilities_1.SERVER_ACTOR_ID}/outbox`),
        url: new URL(`${activitypub_core_utilities_1.SERVER_ACTOR_ID}/outbox`),
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
    };
    const botFollowers = {
        id: new URL(`${activitypub_core_utilities_1.SERVER_ACTOR_ID}/followers`),
        url: new URL(`${activitypub_core_utilities_1.SERVER_ACTOR_ID}/followers`),
        name: 'Followers',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
    };
    const botFollowing = {
        id: new URL(`${activitypub_core_utilities_1.SERVER_ACTOR_ID}/following`),
        url: new URL(`${activitypub_core_utilities_1.SERVER_ACTOR_ID}/following`),
        name: 'Following',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
    };
    const botActor = {
        id: new URL(activitypub_core_utilities_1.SERVER_ACTOR_ID),
        url: new URL(activitypub_core_utilities_1.SERVER_ACTOR_ID),
        type: activitypub_core_types_1.AP.ActorTypes.APPLICATION,
        name: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
        preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
        inbox: botInbox,
        outbox: botOutbox,
        following: botFollowing,
        followers: botFollowers,
        endpoints: {
            sharedInbox: new URL(activitypub_core_utilities_1.SHARED_INBOX_ID),
        },
        publicKey: {
            id: `${activitypub_core_utilities_1.SERVER_ACTOR_ID}#main-key`,
            owner: activitypub_core_utilities_1.SERVER_ACTOR_ID,
            publicKeyPem: botPublicKey,
        },
    };
    await Promise.all([
        databaseService.saveEntity(botActor),
        databaseService.saveEntity(botInbox),
        databaseService.saveEntity(botOutbox),
        databaseService.saveEntity(botFollowing),
        databaseService.saveEntity(botFollowers),
        databaseService.saveString('username', 'bot', 'bot'),
        databaseService.saveString('private-key', 'bot', botPrivateKey),
    ]);
}
exports.createServerActor = createServerActor;
//# sourceMappingURL=createServerActor.js.map