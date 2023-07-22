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
async function handleAccept(activity) {
    (0, type_utilities_1.assertIsApType)(activity, AP.ActivityTypes.ACCEPT);
    const actorId = (0, utilities_1.getId)(activity.actor);
    (0, type_utilities_1.assertExists)(actorId);
    const actor = await this.core.queryById(actorId);
    (0, type_utilities_1.assertIsApActor)(actor);
    const followersId = (0, utilities_1.getId)(actor.followers);
    (0, type_utilities_1.assertExists)(followersId);
    const followActivityId = (0, utilities_1.getId)(activity.object);
    const followActivity = await this.core.queryById(followActivityId);
    (0, type_utilities_1.assertIsApType)(followActivity, AP.ActivityTypes.FOLLOW);
    const followerId = (0, utilities_1.getId)(followActivity.actor);
    (0, type_utilities_1.assertExists)(followerId);
    const requests = await this.core.getStreamByName(actor, 'Requests');
    (0, type_utilities_1.assertIsApType)(requests, AP.CollectionTypes.COLLECTION);
    const requestsId = (0, utilities_1.getId)(requests);
    (0, type_utilities_1.assertExists)(requestsId);
    await Promise.all([
        this.core.insertItem(followersId, followerId),
        this.core.removeItem(requestsId, followActivityId),
    ]);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map