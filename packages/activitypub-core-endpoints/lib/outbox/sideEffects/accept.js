"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccept = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAccept(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.ACCEPT);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    (0, activitypub_core_types_1.assertExists)(actorId);
    const actor = await this.adapters.db.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const followersId = (0, activitypub_core_utilities_1.getId)(actor.followers);
    (0, activitypub_core_types_1.assertExists)(followersId);
    const followActivityId = (0, activitypub_core_utilities_1.getId)(activity.object);
    const followActivity = await this.adapters.db.queryById(followActivityId);
    (0, activitypub_core_types_1.assertIsApType)(followActivity, activitypub_core_types_1.AP.ActivityTypes.FOLLOW);
    const followerId = (0, activitypub_core_utilities_1.getId)(followActivity.actor);
    (0, activitypub_core_types_1.assertExists)(followerId);
    const requests = await this.adapters.db.getStreamByName(actor, 'Requests');
    (0, activitypub_core_types_1.assertIsApType)(requests, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
    const requestsId = (0, activitypub_core_utilities_1.getId)(requests);
    (0, activitypub_core_types_1.assertExists)(requestsId);
    await Promise.all([
        this.adapters.db.insertItem(followersId, followerId),
        this.adapters.db.removeItem(requestsId, followActivityId),
    ]);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map