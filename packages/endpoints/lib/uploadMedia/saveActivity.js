"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActivity = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function saveActivity() {
    if (!this.activity ||
        !this.activity.id ||
        !this.activity.object ||
        this.activity.object instanceof URL ||
        Array.isArray(this.activity.object) ||
        !this.activity.object.id) {
        throw new Error('Bad activity / bad object.');
    }
    const publishedDate = new Date();
    const objectReplies = {
        '@context': new URL(utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.object.id.toString()}/replies`),
        url: new URL(`${this.activity.object.id.toString()}/replies`),
        name: 'Replies',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
    };
    const objectLikes = {
        '@context': new URL(utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.object.id.toString()}/likes`),
        url: new URL(`${this.activity.object.id.toString()}/likes`),
        name: 'Likes',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const objectShares = {
        '@context': new URL(utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${this.activity.object.id.toString()}/shares`),
        url: new URL(`${this.activity.object.id.toString()}/shares`),
        name: 'Shares',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
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
    this.activity.published = publishedDate;
    await Promise.all([
        this.core.saveEntity(objectReplies),
        this.core.saveEntity(objectLikes),
        this.core.saveEntity(objectShares),
        this.core.saveEntity(this.activity.object),
        this.core.saveEntity(this.activity),
        this.core.insertOrderedItem((0, utilities_1.getId)(this.actor?.outbox), this.activity.id),
    ]);
}
exports.saveActivity = saveActivity;
//# sourceMappingURL=saveActivity.js.map