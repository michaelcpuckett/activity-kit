"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientUrls = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const getRecipientsInArrayFormat = (recipientList) => recipientList
    ? Array.isArray(recipientList)
        ? recipientList
        : [recipientList]
    : [];
async function getRecipientUrls(activity) {
    const unfilteredRecipients = [
        ...getRecipientsInArrayFormat(activity.to),
        ...getRecipientsInArrayFormat(activity.cc),
        ...getRecipientsInArrayFormat(activity.bto),
        ...getRecipientsInArrayFormat(activity.bcc),
        ...getRecipientsInArrayFormat(activity.audience),
    ];
    const filteredRecipients = unfilteredRecipients.filter((recipient) => (0, activitypub_core_utilities_1.getId)(recipient)?.toString() !== activitypub_core_utilities_1.PUBLIC_ACTOR);
    const unfilteredRecipientUrls = (await Promise.all(filteredRecipients.map(async (recipient) => {
        if (recipient instanceof URL) {
            const foundRecipient = await this.adapters.db.queryById(recipient);
            if (!foundRecipient) {
                return null;
            }
            try {
                (0, activitypub_core_types_1.assertIsApEntity)(foundRecipient);
            }
            catch (error) {
                return null;
            }
            try {
                (0, activitypub_core_types_1.assertIsApActor)(foundRecipient);
                return (0, activitypub_core_utilities_1.getId)(foundRecipient);
            }
            catch (error) {
            }
            try {
                (0, activitypub_core_types_1.assertIsApCollection)(foundRecipient);
                return await this.adapters.db.getCollectionItemsByPagination(foundRecipient);
            }
            catch (error) {
            }
        }
        try {
            (0, activitypub_core_types_1.assertIsApActor)(recipient);
            return (0, activitypub_core_utilities_1.getId)(recipient);
        }
        catch (error) {
            return null;
        }
    }))).flat();
    const filteredRecipientUrls = [];
    for (const item of unfilteredRecipientUrls) {
        if (item instanceof URL) {
            filteredRecipientUrls.push(item);
        }
    }
    return (0, activitypub_core_utilities_1.deduplicateUrls)(filteredRecipientUrls);
}
exports.getRecipientUrls = getRecipientUrls;
//# sourceMappingURL=getRecipientUrls.js.map