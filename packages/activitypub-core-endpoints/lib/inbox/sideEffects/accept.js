"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccept = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAccept() {
    const activity = this.activity;
    if (!('object' in activity)) {
        throw new Error('Bad activity: no object.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.adapters.db.queryById(objectId);
    if (!object) {
        throw new Error('Bad object: not found.');
    }
    if (object.type !== activitypub_core_types_1.AP.ActivityTypes.FOLLOW) {
        return;
    }
    const followActivity = object;
    const followerId = (0, activitypub_core_utilities_1.getId)(followActivity.actor);
    if (!followerId) {
        throw new Error('Bad follower: no ID.');
    }
    const followeeId = (0, activitypub_core_utilities_1.getId)(followActivity.object);
    if (!followerId) {
        throw new Error('Bad followee: no ID.');
    }
    const follower = await this.adapters.db.queryById(followerId);
    if (!follower) {
        throw new Error('Bad follower: not found.');
    }
    if (!(0, activitypub_core_utilities_1.isTypeOf)(follower, activitypub_core_types_1.AP.ActorTypes)) {
        throw new Error('Bad follower: not an actor.');
    }
    const followee = await this.adapters.db.queryById(followeeId);
    if (!followee) {
        throw new Error('Bad followee: not found.');
    }
    if (!(0, activitypub_core_utilities_1.isTypeOf)(followee, activitypub_core_types_1.AP.ActorTypes)) {
        throw new Error('Bad followee: not an actor.');
    }
    const followingId = (0, activitypub_core_utilities_1.getId)(follower.following);
    if (!followingId) {
        throw new Error('Bad followee: No following collection.');
    }
    const following = await this.adapters.db.queryEntityById(followingId);
    if (!following) {
        throw new Error('Bad followers collection: Not found.');
    }
    if (following.items.map((id) => id.toString()).includes((0, activitypub_core_utilities_1.getId)(followee).toString())) {
        console.log('NOTE: ALREADY FOLLOWING.');
        return;
    }
    await Promise.all([
        this.adapters.db.insertItem(followingId, followeeId),
    ]);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map