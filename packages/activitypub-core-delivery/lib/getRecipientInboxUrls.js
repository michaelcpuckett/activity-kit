"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientInboxUrls = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getRecipientInboxUrls(activity, actor, inboxesOnly) {
    const recipientUrls = await this.getRecipientUrls(activity);
    const unfilteredRecipientInboxUrls = await Promise.all(recipientUrls.map(async (recipient) => {
        try {
            if (recipient.toString() === (0, activitypub_core_utilities_1.getId)(actor).toString()) {
                return null;
            }
            const foundEntity = await this.adapters.db.queryById(recipient);
            (0, activitypub_core_types_1.assertIsApActor)(foundEntity);
            if (!inboxesOnly) {
                if (foundEntity.endpoints) {
                    if (foundEntity.endpoints.sharedInbox instanceof URL) {
                        return foundEntity.endpoints.sharedInbox;
                    }
                }
            }
            return (0, activitypub_core_utilities_1.getId)(foundEntity.inbox);
        }
        catch (error) {
            return null;
        }
    }));
    const recipientInboxUrls = [];
    for (const recipientInbox of unfilteredRecipientInboxUrls) {
        if (recipientInbox instanceof URL) {
            recipientInboxUrls.push(recipientInbox);
        }
    }
    return (0, activitypub_core_utilities_1.deduplicateUrls)(recipientInboxUrls);
}
exports.getRecipientInboxUrls = getRecipientInboxUrls;
//# sourceMappingURL=getRecipientInboxUrls.js.map