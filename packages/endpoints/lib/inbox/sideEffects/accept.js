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
const type_utilities_1 = require("@activity-kit/type-utilities");
const AP = __importStar(require("@activity-kit/types"));
const utilities_1 = require("@activity-kit/utilities");
async function handleAccept(activity, recipient) {
    (0, type_utilities_1.assertIsApType)(activity, AP.ActivityTypes.ACCEPT);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, type_utilities_1.assertExists)(objectId);
    const object = await this.core.queryById(objectId);
    (0, type_utilities_1.assertIsApEntity)(object);
    if (!(0, type_utilities_1.isType)(object, AP.ActivityTypes.FOLLOW)) {
        return;
    }
    const followActivity = object;
    (0, type_utilities_1.assertIsApType)(followActivity, AP.ActivityTypes.FOLLOW);
    const followerId = (0, utilities_1.getId)(followActivity.actor);
    (0, type_utilities_1.assertExists)(followerId);
    if (followerId.toString() !== (0, utilities_1.getId)(recipient)?.toString()) {
        return;
    }
    const follower = await this.core.queryById(followerId);
    (0, type_utilities_1.assertIsApActor)(follower);
    const followeeId = (0, utilities_1.getId)(followActivity.object);
    (0, type_utilities_1.assertExists)(followeeId);
    const followee = await this.core.queryById(followeeId);
    (0, type_utilities_1.assertIsApActor)(followee);
    const followingId = (0, utilities_1.getId)(follower.following);
    (0, type_utilities_1.assertExists)(followingId);
    const following = await this.core.queryById(followingId);
    (0, type_utilities_1.assertIsApType)(following, AP.CollectionTypes.COLLECTION);
    (0, type_utilities_1.assertIsArray)(following.items);
    if (following.items
        .map((item) => (0, utilities_1.getId)(item)?.toString())
        .includes(followeeId.toString())) {
        console.log('Already following.');
        return;
    }
    await this.core.insertItem(followingId, followeeId);
    const requests = await this.core.getStreamByName(follower, 'Requests');
    const requestsId = (0, utilities_1.getId)(requests);
    await this.core.removeItem(requestsId, (0, utilities_1.getId)(followActivity));
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map