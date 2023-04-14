"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientInboxUrls = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getRecipientInboxUrls(activity, actor, inboxesOnly) {
    const recipientUrls = await this.getRecipientUrls(activity);
    const recipientInboxUrls = (await Promise.all(recipientUrls.map(async (recipientUrl) => {
        try {
            if (recipientUrl.toString() === (0, activitypub_core_utilities_1.getId)(actor).toString()) {
                return [];
            }
            const foundEntity = await this.adapters.db.fetchEntityById(recipientUrl);
            (0, activitypub_core_types_1.assertIsApActor)(foundEntity);
            if (!inboxesOnly) {
                if (foundEntity.endpoints) {
                    if (foundEntity.endpoints.sharedInbox instanceof URL) {
                        return [foundEntity.endpoints.sharedInbox];
                    }
                }
            }
            const inboxId = (0, activitypub_core_utilities_1.getId)(foundEntity.inbox);
            if (inboxId instanceof URL) {
                return [inboxId];
            }
        }
        catch (error) {
            return [];
        }
    }))).flat();
    return (0, activitypub_core_utilities_1.deduplicateUrls)(recipientInboxUrls);
}
exports.getRecipientInboxUrls = getRecipientInboxUrls;
//# sourceMappingURL=getRecipientInboxUrls.js.map