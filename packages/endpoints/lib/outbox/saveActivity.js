"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActivity = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function saveActivity() {
    type_utilities_1.assert.isApActivity(this.activity);
    const publishedDate = new Date();
    this.activity.published = publishedDate;
    if (type_utilities_1.guard.isApCoreObject(this.activity.object)) {
        this.activity.object.published = publishedDate;
    }
    const activityId = (0, utilities_1.getId)(this.activity);
    type_utilities_1.assert.exists(activityId);
    const actorId = (0, utilities_1.getId)(this.activity.actor);
    type_utilities_1.assert.exists(actorId);
    const outboxId = (0, utilities_1.getId)(this.actor.outbox);
    type_utilities_1.assert.exists(outboxId);
    await Promise.all([
        this.core.saveEntity(this.activity),
        this.core.insertOrderedItem(outboxId, activityId),
    ]);
}
exports.saveActivity = saveActivity;
//# sourceMappingURL=saveActivity.js.map