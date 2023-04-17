"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientUrls = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const getRecipientsInArrayFormat = (recipientList) => recipientList
    ? Array.isArray(recipientList)
        ? recipientList
        : [recipientList]
    : [];
async function getRecipientUrls(activity) {
    const recipients = [
        ...getRecipientsInArrayFormat(activity.to),
        ...getRecipientsInArrayFormat(activity.cc),
        ...getRecipientsInArrayFormat(activity.bto),
        ...getRecipientsInArrayFormat(activity.bcc),
        ...getRecipientsInArrayFormat(activity.audience),
    ].flat();
    const recipientIds = recipients
        .map((recipient) => (0, utilities_1.getId)(recipient))
        .filter((recipientUrl) => `${recipientUrl}` !== utilities_1.PUBLIC_ACTOR);
    const actorUrls = (await Promise.all(recipientIds.map(async (recipientId) => {
        const foundRecipient = await this.queryById(recipientId);
        if (!foundRecipient) {
            return [];
        }
        try {
            (0, types_1.assertIsApActor)(foundRecipient);
            const actorUrl = foundRecipient.url || foundRecipient.id;
            if (actorUrl instanceof URL) {
                return [actorUrl];
            }
        }
        catch (error) {
        }
        try {
            (0, types_1.assertIsApCollection)(foundRecipient);
            const collectionItems = await this.getPaginatedCollectionItems(foundRecipient);
            const actorsInCollection = [];
            for (const collectionItem of collectionItems) {
                try {
                    const collectionItemId = (0, utilities_1.getId)(collectionItem);
                    (0, types_1.assertExists)(collectionItemId);
                    const expandedCollectionItem = await this.queryById(collectionItemId);
                    (0, types_1.assertIsApActor)(expandedCollectionItem);
                    const actorUrl = expandedCollectionItem.url || expandedCollectionItem.id;
                    if (actorUrl instanceof URL) {
                        actorsInCollection.push(actorUrl);
                    }
                }
                catch (error) {
                }
            }
            return actorsInCollection;
        }
        catch (error) {
        }
        return [];
    }))).flat();
    return (0, utilities_1.deduplicateUrls)(actorUrls);
}
exports.getRecipientUrls = getRecipientUrls;
//# sourceMappingURL=getRecipientUrls.js.map