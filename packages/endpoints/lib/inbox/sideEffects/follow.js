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
exports.handleFollow = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function handleFollow(activity, recipient) {
    const activityId = (0, utilities_1.getId)(activity);
    type_utilities_1.assert.exists(activityId);
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    const object = await this.core.queryById(objectId);
    type_utilities_1.assert.isApEntity(object);
    if (!type_utilities_1.guard.isApActor(object)) {
        return;
    }
    const actorId = (0, utilities_1.getId)(activity.actor);
    type_utilities_1.assert.exists(actorId);
    const actor = await this.core.queryById(actorId);
    type_utilities_1.assert.isApActor(actor);
    const follower = actor;
    const followerId = (0, utilities_1.getId)(follower);
    type_utilities_1.assert.exists(followerId);
    const followee = object;
    const followeeId = (0, utilities_1.getId)(followee);
    type_utilities_1.assert.exists(followeeId);
    if (followeeId.href !== (0, utilities_1.getId)(recipient)?.href) {
        return;
    }
    const followersId = (0, utilities_1.getId)(followee.followers);
    type_utilities_1.assert.exists(followersId);
    const followers = await this.core.findEntityById(followersId);
    type_utilities_1.assert.isApType(followers, AP.CollectionTypes.COLLECTION);
    type_utilities_1.assert.isArray(followers.items);
    if (followers.items
        .map((id) => id?.toString())
        .includes(followerId.toString())) {
        console.log('Already a follower.');
        return;
    }
    if (followee.manuallyApprovesFollowers) {
        const requests = await this.core.getStreamByName(followee, 'Requests');
        type_utilities_1.assert.isApType(requests, AP.CollectionTypes.COLLECTION);
        const requestsId = (0, utilities_1.getId)(requests);
        type_utilities_1.assert.exists(requestsId);
        await this.core.insertItem(requestsId, activityId);
        return;
    }
    const acceptActivityId = `${new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.accept)({
        guid: await this.core.getGuid(),
    })}`)}`;
    const publishedDate = new Date();
    const acceptActivity = (0, utilities_1.applyContext)({
        id: new URL(acceptActivityId),
        url: new URL(acceptActivityId),
        type: AP.ActivityTypes.ACCEPT,
        to: [new URL(utilities_1.PUBLIC_ACTOR), followerId],
        actor: followeeId,
        object: activityId,
        published: publishedDate,
    });
    const followeeOutboxId = (0, utilities_1.getId)(followee.outbox);
    type_utilities_1.assert.exists(followeeOutboxId);
    await Promise.all([
        this.core.saveEntity(acceptActivity),
        this.core.insertOrderedItem(followeeOutboxId, new URL(acceptActivityId)),
        this.core.insertItem(followersId, followerId),
    ]);
    await this.core.broadcast(acceptActivity, followee);
}
exports.handleFollow = handleFollow;
//# sourceMappingURL=follow.js.map