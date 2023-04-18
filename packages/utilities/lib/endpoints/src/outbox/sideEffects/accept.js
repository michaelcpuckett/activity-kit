"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccept = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function handleAccept(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.ACCEPT);
    const actorId = (0, utilities_1.getId)(activity.actor);
    (0, types_1.assertExists)(actorId);
    const actor = await this.core.queryById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const followersId = (0, utilities_1.getId)(actor.followers);
    (0, types_1.assertExists)(followersId);
    const followActivityId = (0, utilities_1.getId)(activity.object);
    const followActivity = await this.core.queryById(followActivityId);
    (0, types_1.assertIsApType)(followActivity, types_1.AP.ActivityTypes.FOLLOW);
    const followerId = (0, utilities_1.getId)(followActivity.actor);
    (0, types_1.assertExists)(followerId);
    const requests = await this.core.getStreamByName(actor, 'Requests');
    (0, types_1.assertIsApType)(requests, types_1.AP.CollectionTypes.COLLECTION);
    const requestsId = (0, utilities_1.getId)(requests);
    (0, types_1.assertExists)(requestsId);
    await Promise.all([
        this.core.insertItem(followersId, followerId),
        this.core.removeItem(requestsId, followActivityId),
    ]);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map