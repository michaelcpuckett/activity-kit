"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActivity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function saveActivity() {
    (0, activitypub_core_types_1.assertIsApActivity)(this.activity);
    const publishedDate = new Date();
    this.activity.published = publishedDate;
    const activityId = (0, activitypub_core_utilities_1.getId)(this.activity);
    (0, activitypub_core_types_1.assertExists)(activityId);
    const actorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
    (0, activitypub_core_types_1.assertExists)(actorId);
    const repliesId = new URL(`${activityId.toString()}/replies`);
    const replies = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: repliesId,
        url: repliesId,
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        attributedTo: actorId,
        published: publishedDate,
    };
    const likesId = new URL(`${activityId.toString()}/likes`);
    const likes = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: likesId,
        url: likesId,
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        attributedTo: actorId,
        published: publishedDate,
    };
    const sharesId = new URL(`${activityId.toString()}/shares`);
    const shares = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: sharesId,
        url: sharesId,
        name: 'Shares',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        attributedTo: actorId,
        published: publishedDate,
    };
    this.activity.replies = repliesId;
    this.activity.likes = likesId;
    this.activity.shares = sharesId;
    const outboxId = (0, activitypub_core_utilities_1.getId)(this.actor.outbox);
    (0, activitypub_core_types_1.assertExists)(outboxId);
    await Promise.all([
        this.adapters.db.saveEntity(this.activity),
        this.adapters.db.saveEntity(replies),
        this.adapters.db.saveEntity(likes),
        this.adapters.db.saveEntity(shares),
        this.adapters.db.insertOrderedItem(outboxId, activityId),
    ]);
}
exports.saveActivity = saveActivity;
//# sourceMappingURL=saveActivity.js.map