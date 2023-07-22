"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActivity = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function saveActivity() {
    (0, types_1.assertIsApEntity)(this.activity);
    (0, types_1.assertIsApTransitiveActivity)(this.activity);
    (0, types_1.assertIsApExtendedObject)(this.activity.object);
    const publishedDate = new Date();
    const getRouteUrl = (route, data) => new URL((0, path_to_regexp_1.compile)(route, {
        validate: false,
    })(data), utilities_1.LOCAL_DOMAIN);
    const entityRoute = `${this.activity.object.id}`;
    const objectRepliesId = getRouteUrl(this.routes.replies, {
        entityRoute,
    });
    const objectReplies = (0, utilities_1.applyContext)({
        id: objectRepliesId,
        url: objectRepliesId,
        name: 'Replies',
        type: types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
    });
    const objectLikesId = getRouteUrl(this.routes.likes, {
        entityRoute,
    });
    const objectLikes = (0, utilities_1.applyContext)({
        id: objectLikesId,
        url: objectLikesId,
        name: 'Likes',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    });
    const objectSharesId = getRouteUrl(this.routes.shares, {
        entityRoute,
    });
    const objectShares = (0, utilities_1.applyContext)({
        id: objectSharesId,
        url: objectSharesId,
        name: 'Shares',
        type: types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    });
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