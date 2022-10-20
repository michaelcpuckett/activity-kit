"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientsList = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getRecipientsList(to) {
    const toArray = Array.isArray(to) ? to : [to];
    const filteredToArray = toArray.filter((recipient) => recipient.toString() !== activitypub_core_utilities_1.PUBLIC_ACTOR);
    const unfilteredInboxArray = (await Promise.all(filteredToArray.map(async (reference) => {
        if (reference instanceof URL) {
            const foundThing = await this.databaseService.queryById(reference);
            if (!foundThing) {
                return null;
            }
            if (typeof foundThing === 'object' &&
                'inbox' in foundThing &&
                foundThing.inbox) {
                return foundThing.id;
            }
            if ((typeof foundThing === 'object' &&
                foundThing.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) ||
                (Array.isArray(foundThing.type) &&
                    foundThing.type.includes(activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION))) {
                if (foundThing.orderedItems) {
                    return foundThing.orderedItems;
                }
            }
            if ((typeof foundThing === 'object' &&
                foundThing.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION) ||
                (Array.isArray(foundThing.type) &&
                    foundThing.type.includes(activitypub_core_types_1.AP.CollectionTypes.COLLECTION))) {
                if (foundThing.items) {
                    return foundThing.items;
                }
            }
            if (typeof foundThing === 'object' &&
                (foundThing.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION ||
                    foundThing.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION ||
                    (Array.isArray(foundThing.type) &&
                        (foundThing.type.includes(activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) ||
                            foundThing.type.includes(activitypub_core_types_1.AP.CollectionTypes.COLLECTION))))) {
                if (foundThing.first) {
                    const foundCollectionPage = await this.databaseService.queryById(foundThing.first);
                    if (typeof foundCollectionPage === 'object' &&
                        (foundCollectionPage.type ===
                            activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE ||
                            (Array.isArray(foundCollectionPage.type) &&
                                foundCollectionPage.type.includes(activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE))) &&
                        foundCollectionPage.orderedItems) {
                        return foundCollectionPage.orderedItems;
                    }
                    if (typeof foundCollectionPage === 'object' &&
                        (foundCollectionPage.type ===
                            activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE ||
                            (Array.isArray(foundCollectionPage.type) &&
                                foundCollectionPage.type.includes(activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE))) &&
                        foundCollectionPage.items) {
                        return foundCollectionPage.items;
                    }
                }
            }
            return null;
        }
        if ('id' in reference) {
            return reference.id;
        }
        if ('href' in reference) {
            return reference.href;
        }
    }))).flat();
    const result = [];
    for (const item of unfilteredInboxArray) {
        if (item instanceof URL) {
            result.push(item);
        }
    }
    return result;
}
exports.getRecipientsList = getRecipientsList;
//# sourceMappingURL=getRecipientsList.js.map