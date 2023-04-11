"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientsList = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getRecipientsList(to) {
    const toArray = Array.isArray(to) ? to : [to];
    const filteredToArray = toArray.filter((recipient) => recipient.toString() !== activitypub_core_utilities_1.PUBLIC_ACTOR);
    const unfilteredRecipientsArray = (await Promise.all(filteredToArray.map(async (reference) => {
        if (reference instanceof URL) {
            const foundEntity = await this.adapters.db.queryById(reference);
            if (!foundEntity) {
                return null;
            }
            (0, activitypub_core_types_1.assertIsApEntity)(foundEntity);
            if ((0, activitypub_core_utilities_1.isTypeOf)(foundEntity, activitypub_core_types_1.AP.ActorTypes)) {
                return foundEntity.id;
            }
            if ((0, activitypub_core_utilities_1.isType)(foundEntity, activitypub_core_types_1.AP.CollectionTypes.COLLECTION) ||
                (0, activitypub_core_utilities_1.isType)(foundEntity, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
                (0, activitypub_core_types_1.assertIsApCollection)(foundEntity);
                const collectionItems = [];
                if (!foundEntity.first) {
                    if (foundEntity.orderedItems) {
                        collectionItems.push(foundEntity.orderedItems);
                    }
                    else if (foundEntity.items) {
                        collectionItems.push(foundEntity.items);
                    }
                }
                else {
                    const foundCollectionPage = await this.adapters.db.queryById((0, activitypub_core_utilities_1.getId)(foundEntity.first));
                    (0, activitypub_core_types_1.assertIsApTypeOf)(foundCollectionPage, Object.values(activitypub_core_types_1.AP.CollectionPageTypes));
                    let nextCollectionPage = foundCollectionPage;
                    while (nextCollectionPage) {
                        (0, activitypub_core_types_1.assertIsApTypeOf)(nextCollectionPage, Object.values(activitypub_core_types_1.AP.CollectionPageTypes));
                        const collectionPageItems = foundCollectionPage.orderedItems || foundCollectionPage.items;
                        collectionItems.push(collectionPageItems);
                        const nextCollectionPageId = (0, activitypub_core_utilities_1.getId)(nextCollectionPage.next);
                        let foundNextCollectionPage = null;
                        if (nextCollectionPageId) {
                            foundNextCollectionPage = await this.adapters.db.queryById(nextCollectionPageId);
                        }
                        nextCollectionPage = foundNextCollectionPage;
                    }
                }
                return collectionItems.flat();
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
    for (const item of unfilteredRecipientsArray) {
        if (item instanceof URL) {
            result.push(item);
        }
    }
    return result;
}
exports.getRecipientsList = getRecipientsList;
//# sourceMappingURL=getRecipientsList.js.map