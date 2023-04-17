"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActivity = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function saveActivity() {
    (0, types_1.assertIsApActivity)(this.activity);
    const publishedDate = new Date();
    this.activity.published = publishedDate;
    const activityId = (0, utilities_1.getId)(this.activity);
    (0, types_1.assertExists)(activityId);
    const actorId = (0, utilities_1.getId)(this.activity.actor);
    (0, types_1.assertExists)(actorId);
    const outboxId = (0, utilities_1.getId)(this.actor.outbox);
    (0, types_1.assertExists)(outboxId);
    await Promise.all([
        this.core.saveEntity(this.activity),
        this.core.insertOrderedItem(outboxId, activityId),
    ]);
}
exports.saveActivity = saveActivity;
//# sourceMappingURL=saveActivity.js.map