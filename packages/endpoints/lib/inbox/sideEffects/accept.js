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
exports.handleAccept = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleAccept(activity, recipient) {
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    const object = await this.core.queryById(objectId);
    type_utilities_1.assert.isApEntity(object);
    if (!type_utilities_1.guard.isApType(object, AP.ActivityTypes.FOLLOW)) {
        return;
    }
    const followActivity = object;
    type_utilities_1.assert.isApType(followActivity, AP.ActivityTypes.FOLLOW);
    const followerId = (0, utilities_1.getId)(followActivity.actor);
    type_utilities_1.assert.exists(followerId);
    if (followerId.href !== (0, utilities_1.getId)(recipient)?.href) {
        // Not applicable to this Actor.
        return;
    }
    const follower = await this.core.queryById(followerId);
    type_utilities_1.assert.isApActor(follower);
    const followeeId = (0, utilities_1.getId)(followActivity.object);
    type_utilities_1.assert.exists(followeeId);
    const followee = await this.core.queryById(followeeId);
    type_utilities_1.assert.isApActor(followee);
    const followingId = (0, utilities_1.getId)(follower.following);
    type_utilities_1.assert.exists(followingId);
    const following = await this.core.queryById(followingId);
    type_utilities_1.assert.isApType(following, AP.CollectionTypes.COLLECTION);
    type_utilities_1.assert.isArray(following.items);
    // Already following.
    if (following.items
        .map((item) => (0, utilities_1.getId)(item)?.href)
        .includes(followeeId.href)) {
        console.log('Already following.');
        return;
    }
    await this.core.insertItem(followingId, followeeId);
    const requests = await this.core.getStreamByName(follower, 'Requests');
    type_utilities_1.assert.exists(requests);
    const requestsId = (0, utilities_1.getId)(requests);
    type_utilities_1.assert.exists(requestsId);
    const followActivityId = (0, utilities_1.getId)(followActivity);
    type_utilities_1.assert.exists(followActivityId);
    await this.core.removeItem(requestsId, followActivityId);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map