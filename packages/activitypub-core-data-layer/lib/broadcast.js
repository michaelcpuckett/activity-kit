"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
async function broadcast(activity, actor) {
    const publicActivity = (0, activitypub_core_utilities_1.cleanProps)((0, activitypub_core_utilities_2.applyContext)(activity));
    if (!('actor' in publicActivity)) {
        throw new Error('Not an activity?');
    }
    const recipients = await this.getRecipientInboxUrls(activity, actor);
    console.log({
        recipients,
    });
    const results = await Promise.all(recipients.map(async (recipient) => {
        return await this.signAndSendToForeignActorInbox(recipient, actor, publicActivity);
    }));
    return results;
}
exports.broadcast = broadcast;
//# sourceMappingURL=broadcast.js.map