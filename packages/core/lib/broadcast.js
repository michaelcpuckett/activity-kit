"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function broadcast(activity, actor) {
    const entity = (0, utilities_1.applyContext)(activity);
    type_utilities_1.assert.isApActivity(entity);
    const publicActivity = (0, utilities_1.cleanProps)(entity);
    if (!('actor' in publicActivity)) {
        throw new Error('Not an activity?');
    }
    const recipients = await this.getRecipientInboxUrls(activity, actor);
    const results = await Promise.all(recipients.map(async (recipient) => {
        return await this.signAndSendToForeignActorInbox(recipient, actor, publicActivity);
    }));
    return results;
}
exports.broadcast = broadcast;
//# sourceMappingURL=broadcast.js.map