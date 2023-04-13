"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionItemsByPagination = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getCollectionItemsByPagination(collection) {
    const collectionItems = [];
    try {
        (0, activitypub_core_types_1.assertIsApCollection)(collection);
        const firstCollectionPageId = (0, activitypub_core_utilities_1.getId)(collection.first);
        if (!firstCollectionPageId) {
            if (Array.isArray(collection.orderedItems)) {
                collectionItems.push(collection.orderedItems);
            }
            else if (Array.isArray(collection.items)) {
                collectionItems.push(collection.items);
            }
        }
        else {
            const firstCollectionPage = await this.queryById(firstCollectionPageId);
            try {
                (0, activitypub_core_types_1.assertIsApTypeOf)(firstCollectionPage, Object.values(activitypub_core_types_1.AP.CollectionPageTypes));
                let nextCollectionPage = firstCollectionPage;
                while (nextCollectionPage) {
                    try {
                        (0, activitypub_core_types_1.assertIsApTypeOf)(nextCollectionPage, Object.values(activitypub_core_types_1.AP.CollectionPageTypes));
                        const collectionPageItems = firstCollectionPage.orderedItems || firstCollectionPage.items;
                        (0, activitypub_core_types_1.assertIsArray)(collectionPageItems);
                        collectionItems.push(collectionPageItems);
                        const nextCollectionPageId = (0, activitypub_core_utilities_1.getId)(nextCollectionPage.next);
                        (0, activitypub_core_types_1.assertExists)(nextCollectionPageId);
                        const potentialNextCollectionPage = await this.queryById(nextCollectionPageId);
                        (0, activitypub_core_types_1.assertIsApTypeOf)(potentialNextCollectionPage, Object.values(activitypub_core_types_1.AP.CollectionPageTypes));
                        nextCollectionPage = potentialNextCollectionPage;
                    }
                    catch (error) {
                        nextCollectionPage = null;
                    }
                }
            }
            catch (error) { }
        }
        return collectionItems.flat();
    }
    catch (error) {
        return [];
    }
}
exports.getCollectionItemsByPagination = getCollectionItemsByPagination;
//# sourceMappingURL=getCollectionItemsByPagination.js.map