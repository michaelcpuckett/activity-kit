"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function handleCreate(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.CREATE);
    const actorId = (0, activitypub_core_utilities_3.getId)(activity.actor);
    (0, activitypub_core_types_1.assertExists)(actorId);
    const object = activity.object;
    if (object instanceof URL) {
        throw new Error('Bad object: URL reference is not allowed for Create.');
    }
    if (Array.isArray(object)) {
        throw new Error('Internal error: Object array not supported currently. TODO.');
    }
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    const publishedDate = new Date();
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const [{ value: month }, , { value: day }, , { value: year }] = dateFormatter.formatToParts(publishedDate);
    const slug = 'summary' in object
        ? object.summary
            ?.toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') ?? ''
        : '';
    const type = Array.isArray(object.type) ? object.type[0] : object.type;
    const objectId = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes[type.toLowerCase()])({
        guid: (0, activitypub_core_utilities_3.getGuid)(),
        year,
        month,
        day,
        slug,
    })}`);
    object.id = objectId;
    if ((0, activitypub_core_utilities_1.isTypeOf)(object, activitypub_core_types_1.AP.ExtendedObjectTypes)) {
        (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
        object.url = objectId;
        const entityRoute = objectId.pathname;
        const objectRepliesId = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.replies)({
            entityRoute,
        })}`);
        const objectReplies = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: objectRepliesId,
            url: objectRepliesId,
            name: 'Replies',
            type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
            totalItems: 0,
            items: [],
            published: publishedDate,
            attributedTo: actorId,
        };
        const objectLikesId = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.likes)({
            entityRoute,
        })}`);
        const objectLikes = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: objectLikesId,
            url: objectLikesId,
            name: 'Likes',
            type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
            attributedTo: actorId,
        };
        const objectSharesId = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.shares)({
            entityRoute,
        })}`);
        const objectShares = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: objectSharesId,
            url: objectSharesId,
            name: 'Shares',
            type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
            attributedTo: actorId,
        };
        object.attributedTo = actorId;
        object.replies = objectRepliesId;
        object.likes = objectLikesId;
        object.shares = objectSharesId;
        object.published = publishedDate;
        await Promise.all([
            this.adapters.db.saveEntity(object),
            this.adapters.db.saveEntity(objectReplies),
            this.adapters.db.saveEntity(objectLikes),
            this.adapters.db.saveEntity(objectShares),
        ]);
        if (object.inReplyTo) {
            const objectInReplyTo = await this.adapters.db.findEntityById((0, activitypub_core_utilities_3.getId)(object.inReplyTo));
            if (objectInReplyTo && 'replies' in objectInReplyTo) {
                const repliesCollectionId = (0, activitypub_core_utilities_3.getId)(objectInReplyTo.replies);
                if (repliesCollectionId) {
                    await this.adapters.db.insertOrderedItem(repliesCollectionId, objectId);
                }
            }
        }
    }
    else {
        await this.adapters.db.saveEntity(object);
    }
    (0, activitypub_core_types_1.assertIsApType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.CREATE);
    this.activity.object = object;
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map