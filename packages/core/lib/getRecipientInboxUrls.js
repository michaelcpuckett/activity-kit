"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientInboxUrls = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function getRecipientInboxUrls(activity, actor, inboxesOnly) {
    const recipientUrls = await this.getRecipientUrls(activity);
    const recipientInboxUrls = await Promise.all(recipientUrls.map(async (recipientUrl) => {
        return await mapRecipientUrl.bind(this)(recipientUrl, actor, inboxesOnly);
    }));
    return (0, utilities_1.deduplicateUrls)(recipientInboxUrls.flat().filter(type_utilities_1.guard.isUrl));
}
exports.getRecipientInboxUrls = getRecipientInboxUrls;
async function mapRecipientUrl(recipientUrl, actor, inboxesOnly) {
    var _a;
    if (recipientUrl.href === ((_a = (0, utilities_1.getId)(actor)) === null || _a === void 0 ? void 0 : _a.href)) {
        return [];
    }
    const foundEntity = await this.fetchEntityById(recipientUrl);
    if (!type_utilities_1.guard.isApActor(foundEntity)) {
        return [];
    }
    if (!inboxesOnly) {
        if (foundEntity.endpoints) {
            if (type_utilities_1.guard.isUrl(foundEntity.endpoints.sharedInbox)) {
                return [foundEntity.endpoints.sharedInbox];
            }
        }
    }
    const inboxId = (0, utilities_1.getId)(foundEntity.inbox);
    if (type_utilities_1.guard.isUrl(inboxId)) {
        return [inboxId];
    }
    return [];
}
//# sourceMappingURL=getRecipientInboxUrls.js.map