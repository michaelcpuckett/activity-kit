"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientUrls = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function getRecipientUrls(activity) {
    const tags = type_utilities_1.guard.isApCoreObject(activity.object) && activity.object.tag
        ? getArray(activity.object.tag)
        : [];
    const mentions = tags.map(utilities_1.getId).filter(type_utilities_1.guard.isUrl);
    const recipients = [
        ...getArray(activity.to),
        ...getArray(activity.cc),
        ...getArray(activity.bto),
        ...getArray(activity.bcc),
        ...getArray(activity.audience),
        ...mentions,
    ].flat();
    const recipientIds = recipients
        .map(utilities_1.getId)
        .filter(type_utilities_1.guard.isUrl)
        .filter((recipientUrl) => recipientUrl.href !== utilities_1.PUBLIC_ACTOR);
    const actorUrls = await Promise.all(recipientIds.map(getActorIds.bind(this)));
    return (0, utilities_1.deduplicateUrls)(actorUrls.flat());
}
exports.getRecipientUrls = getRecipientUrls;
async function getActorIds(recipientId) {
    const foundRecipient = await this.queryById(recipientId);
    if (!foundRecipient) {
        return [];
    }
    if (type_utilities_1.guard.isApActor(foundRecipient)) {
        const actorUrl = (0, utilities_1.getId)(foundRecipient);
        if (type_utilities_1.guard.isUrl(actorUrl)) {
            return [actorUrl];
        }
    }
    if (type_utilities_1.guard.isApCollection(foundRecipient)) {
        const collectionItems = await this.getPaginatedCollectionItems(foundRecipient);
        const actorsInCollection = [];
        for (const collectionItem of collectionItems) {
            const collectionItemId = (0, utilities_1.getId)(collectionItem);
            if (!type_utilities_1.guard.isUrl(collectionItemId)) {
                continue;
            }
            const expandedCollectionItem = await this.queryById(collectionItemId);
            if (!type_utilities_1.guard.isApActor(expandedCollectionItem)) {
                continue;
            }
            const actorUrl = (0, utilities_1.getId)(expandedCollectionItem);
            if (!type_utilities_1.guard.isUrl(actorUrl)) {
                continue;
            }
            actorsInCollection.push(actorUrl);
        }
        return actorsInCollection;
    }
    return [];
}
function getArray(items) {
    if (!items) {
        return [];
    }
    const array = type_utilities_1.guard.isArray(items) ? items : [items];
    return array.filter((item) => {
        return type_utilities_1.guard.isApEntity(item) || type_utilities_1.guard.isUrl(item);
    });
}
//# sourceMappingURL=getRecipientUrls.js.map