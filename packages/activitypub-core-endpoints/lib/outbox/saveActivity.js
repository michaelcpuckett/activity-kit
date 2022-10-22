"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActivity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function saveActivity() {
    if (!this.activity) {
        throw new Error('No activity.');
    }
    const publishedDate = new Date();
    this.activity.published = publishedDate;
    const activityId = this.activity.id;
    const replies = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${activityId.toString()}/replies`),
        url: new URL(`${activityId.toString()}/replies`),
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
    };
    const likes = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${activityId.toString()}/likes`),
        url: new URL(`${activityId.toString()}/likes`),
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const shares = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${activityId.toString()}/shares`),
        url: new URL(`${activityId.toString()}/shares`),
        name: 'Shares',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    if (replies.id instanceof URL) {
        this.activity.replies = replies.id;
    }
    if (likes.id instanceof URL) {
        this.activity.likes = likes.id;
    }
    if (shares.id instanceof URL) {
        this.activity.shares = shares.id;
    }
    await Promise.all([
        this.databaseService.saveEntity(this.activity),
        this.databaseService.saveEntity(replies),
        this.databaseService.saveEntity(likes),
        this.databaseService.saveEntity(shares),
        this.databaseService.insertOrderedItem((0, activitypub_core_utilities_1.getId)(this.actor?.outbox), activityId),
    ]);
}
exports.saveActivity = saveActivity;
//# sourceMappingURL=saveActivity.js.map