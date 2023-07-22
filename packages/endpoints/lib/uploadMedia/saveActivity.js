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
exports.saveActivity = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function saveActivity() {
    (0, type_utilities_1.assertIsApEntity)(this.activity);
    (0, type_utilities_1.assertIsApTransitiveActivity)(this.activity);
    (0, type_utilities_1.assertIsApExtendedObject)(this.activity.object);
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
        type: AP.CollectionTypes.COLLECTION,
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
        type: AP.CollectionTypes.ORDERED_COLLECTION,
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
        type: AP.CollectionTypes.ORDERED_COLLECTION,
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