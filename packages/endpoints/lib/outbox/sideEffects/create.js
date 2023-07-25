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
exports.handleCreate = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function handleCreate(activity) {
    const actorId = (0, utilities_1.getId)(activity.actor);
    type_utilities_1.assert.exists(actorId);
    const object = activity.object;
    if (object instanceof URL) {
        throw new Error('Bad object: URL reference is not allowed for Create.');
    }
    if (Array.isArray(object)) {
        throw new Error('Internal error: Object array not supported currently. TODO.');
    }
    type_utilities_1.assert.isApEntity(object);
    const publishedDate = new Date();
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const [{ value: month }, , { value: day }, , { value: year }] = dateFormatter.formatToParts(publishedDate);
    const type = Array.isArray(object.type) ? object.type[0] : object.type;
    const objectId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes[type.toLowerCase()])({
        guid: await this.core.getGuid(),
        year,
        month,
        day,
    })}`);
    object.id = objectId;
    if (type_utilities_1.guard.isApExtendedObject(object)) {
        object.url = objectId;
        const entityRoute = objectId.pathname;
        const objectRepliesId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.replies, {
            validate: false,
        })({
            entityRoute,
        })}`);
        const objectReplies = (0, utilities_1.applyContext)({
            id: objectRepliesId,
            url: objectRepliesId,
            name: 'Replies',
            type: AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
            attributedTo: actorId,
        });
        const objectLikesId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.likes, {
            validate: false,
        })({
            entityRoute,
        })}`);
        const objectLikes = (0, utilities_1.applyContext)({
            id: objectLikesId,
            url: objectLikesId,
            name: 'Likes',
            type: AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
            attributedTo: actorId,
        });
        const objectSharesId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.shares, {
            validate: false,
        })({
            entityRoute,
        })}`);
        const objectShares = (0, utilities_1.applyContext)({
            id: objectSharesId,
            url: objectSharesId,
            name: 'Shares',
            type: AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
            attributedTo: actorId,
        });
        object.attributedTo = actorId;
        object.replies = objectRepliesId;
        object.likes = objectLikesId;
        object.shares = objectSharesId;
        object.published = publishedDate;
        if (object.inReplyTo) {
            const inReplyToId = (0, utilities_1.getId)(object.inReplyTo);
            type_utilities_1.assert.exists(inReplyToId);
            const objectInReplyTo = await this.core.findEntityById(inReplyToId);
            if (objectInReplyTo && 'replies' in objectInReplyTo) {
                const repliesCollectionId = (0, utilities_1.getId)(objectInReplyTo.replies);
                if (repliesCollectionId) {
                    await this.core.insertOrderedItem(repliesCollectionId, objectId);
                }
            }
        }
        await Promise.all([
            this.core.saveEntity(object),
            this.core.saveEntity(objectReplies),
            this.core.saveEntity(objectLikes),
            this.core.saveEntity(objectShares),
        ]);
    }
    else {
        await this.core.saveEntity(object);
    }
    type_utilities_1.assert.isApType(this.activity, AP.ActivityTypes.CREATE);
    this.activity.object = object;
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map