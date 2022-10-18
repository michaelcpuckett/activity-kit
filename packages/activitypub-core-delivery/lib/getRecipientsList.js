"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientsList = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getRecipientsList(to) {
    const toArray = Array.isArray(to) ? to : [to];
    console.log({
        toArray,
    });
    const filteredToArray = toArray.filter((recipient) => recipient.toString() !== activitypub_core_utilities_1.PUBLIC_ACTOR);
    const unfilteredInboxArray = (await Promise.all(filteredToArray.map(async (reference) => {
        if (reference instanceof URL) {
            const foundThing = (0, activitypub_core_utilities_1.convertStringsToUrls)(await this.databaseService.queryById(reference));
            if (!foundThing) {
                return null;
            }
            console.log(foundThing);
            console.log('^--foundThing, getRecipientsList');
            if (typeof foundThing === 'object' &&
                'inbox' in foundThing &&
                foundThing.inbox) {
                return foundThing.id;
            }
            if (typeof foundThing === 'object' &&
                foundThing.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
                if (foundThing.orderedItems) {
                    return foundThing.orderedItems;
                }
            }
            if (typeof foundThing === 'object' &&
                foundThing.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION) {
                if (foundThing.items) {
                    return foundThing.items;
                }
            }
            if (typeof foundThing === 'object' &&
                (foundThing.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION ||
                    foundThing.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
                console.log('Correct Type...');
                if (foundThing.first) {
                    const foundCollectionPage = (0, activitypub_core_utilities_1.convertStringsToUrls)(await this.databaseService.queryById(foundThing.first));
                    console.log(foundCollectionPage, '^--FOUND COLLECTION PAGE');
                    if (typeof foundCollectionPage === 'object' &&
                        foundCollectionPage.type === activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE &&
                        foundCollectionPage.orderedItems) {
                        console.log(foundCollectionPage.orderedItems);
                        console.log('^-- ordered items');
                        return foundCollectionPage.orderedItems;
                    }
                    if (typeof foundCollectionPage === 'object' &&
                        foundCollectionPage.type === activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE &&
                        foundCollectionPage.items) {
                        console.log('has items');
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