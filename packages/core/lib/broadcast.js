"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = void 0;
const utilities_1 = require("@activity-kit/utilities");
async function broadcast(activity, actor) {
    const publicActivity = (0, utilities_1.cleanProps)((0, utilities_1.applyContext)(activity));
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