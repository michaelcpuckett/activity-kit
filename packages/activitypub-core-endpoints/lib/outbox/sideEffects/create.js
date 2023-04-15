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
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const path_to_regexp_1 = require("path-to-regexp");
const cheerio = __importStar(require("cheerio"));
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
    const summary = 'summary' in object ? object.summary ?? '' : '';
    const slug = cheerio
        .load(summary, null, false)
        .text()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const type = Array.isArray(object.type) ? object.type[0] : object.type;
    const objectId = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes[type.toLowerCase()])({
        guid: await this.lib.getGuid(),
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
        const objectRepliesId = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.replies, {
            validate: false,
        })({
            entityRoute,
        })}`);
        const objectReplies = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: objectRepliesId,
            url: objectRepliesId,
            name: 'Replies',
            type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
            attributedTo: actorId,
        };
        const objectLikesId = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.likes, {
            validate: false,
        })({
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
        const objectSharesId = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.shares, {
            validate: false,
        })({
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
        if (object.inReplyTo) {
            const objectInReplyTo = await this.lib.findEntityById((0, activitypub_core_utilities_3.getId)(object.inReplyTo));
            if (objectInReplyTo && 'replies' in objectInReplyTo) {
                const repliesCollectionId = (0, activitypub_core_utilities_3.getId)(objectInReplyTo.replies);
                if (repliesCollectionId) {
                    await this.lib.insertOrderedItem(repliesCollectionId, objectId);
                }
            }
        }
        if (object.tag) {
            const tags = Array.isArray(object.tag) ? object.tag : [object.tag];
            for (const tag of tags) {
                if (!(tag instanceof URL) &&
                    (0, activitypub_core_utilities_1.isType)(tag, activitypub_core_types_1.AP.ExtendedObjectTypes.HASHTAG)) {
                    (0, activitypub_core_types_1.assertIsApType)(tag, activitypub_core_types_1.AP.ExtendedObjectTypes.HASHTAG);
                    const hashtagCollectionUrl = new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.hashtag)({
                        slug: tag.name
                            .replace('#', '')
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, ''),
                    })}`);
                    tag.id = hashtagCollectionUrl;
                    tag.url = hashtagCollectionUrl;
                    const hashtagCollection = await this.lib.findEntityById(hashtagCollectionUrl);
                    if (!hashtagCollection) {
                        const hashtagEntity = {
                            id: hashtagCollectionUrl,
                            url: hashtagCollectionUrl,
                            name: tag.name,
                            type: [
                                activitypub_core_types_1.AP.ExtendedObjectTypes.HASHTAG,
                                activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
                            ],
                            orderedItems: [],
                        };
                        await this.lib.saveEntity(hashtagEntity);
                        const serverActor = await this.lib.findOne('entity', {
                            preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
                        });
                        (0, activitypub_core_types_1.assertIsApActor)(serverActor);
                        const serverHashtags = await this.lib.getStreamByName(serverActor, 'Hashtags');
                        const serverHashtagsUrl = serverHashtags.id;
                        await this.lib.insertItem(serverHashtagsUrl, hashtagCollectionUrl);
                    }
                    await this.lib.insertOrderedItem(hashtagCollectionUrl, objectId);
                }
            }
            object.tag = tags;
        }
        await Promise.all([
            this.lib.saveEntity(object),
            this.lib.saveEntity(objectReplies),
            this.lib.saveEntity(objectLikes),
            this.lib.saveEntity(objectShares),
        ]);
    }
    else {
        await this.lib.saveEntity(object);
    }
    (0, activitypub_core_types_1.assertIsApType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.CREATE);
    this.activity.object = object;
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map