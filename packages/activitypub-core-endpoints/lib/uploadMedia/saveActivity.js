"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActivity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function saveActivity() {
    if (!this.activity || !this.activity.id || !this.activity.object || this.activity.object instanceof URL || Array.isArray(this.activity.object) || !this.activity.object.id) {
        throw new Error('Bad activity / bad object.');
    }
    const publishedDate = new Date();
    const objectReplies = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.object.id.toString()}/replies`),
        url: new URL(`${this.activity.object.id.toString()}/replies`),
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
    };
    const objectLikes = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.object.id.toString()}/likes`),
        url: new URL(`${this.activity.object.id.toString()}/likes`),
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const objectShares = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.object.id.toString()}/shares`),
        url: new URL(`${this.activity.object.id.toString()}/shares`),
        name: 'Shares',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    if (objectLikes.id instanceof URL) {
        this.activity.object.likes = objectLikes.id;
    }
    if (objectShares.id instanceof URL) {
        this.activity.object.shares = objectShares.id;
    }
    if (objectReplies.id instanceof URL) {
        this.activity.object.replies = objectReplies.id;
    }
    this.activity.object.published = publishedDate;
    const activityReplies = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.id.toString()}/replies`),
        url: new URL(`${this.activity.id.toString()}/replies`),
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
    };
    const activityLikes = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.id.toString()}/likes`),
        url: new URL(`${this.activity.id.toString()}/likes`),
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const activityShares = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.id.toString()}/shares`),
        url: new URL(`${this.activity.id.toString()}/shares`),
        name: 'Shares',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    if (activityLikes.id instanceof URL) {
        this.activity.likes = activityLikes.id;
    }
    if (activityShares.id instanceof URL) {
        this.activity.shares = activityShares.id;
    }
    if (activityReplies.id instanceof URL) {
        this.activity.replies = activityReplies.id;
    }
    this.activity.published = publishedDate;
    await Promise.all([
        this.adapters.database.saveEntity(objectReplies),
        this.adapters.database.saveEntity(objectLikes),
        this.adapters.database.saveEntity(objectShares),
        this.adapters.database.saveEntity(this.activity.object),
        this.adapters.database.saveEntity(activityReplies),
        this.adapters.database.saveEntity(activityLikes),
        this.adapters.database.saveEntity(activityShares),
        this.adapters.database.saveEntity(this.activity),
        this.adapters.database.insertOrderedItem((0, activitypub_core_utilities_1.getId)(this.actor?.outbox), this.activity.id),
    ]);
}
exports.saveActivity = saveActivity;
//# sourceMappingURL=saveActivity.js.map