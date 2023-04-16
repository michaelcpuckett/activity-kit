"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedCollectionItems = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function getPaginatedCollectionItems(collection) {
    const collectionItems = [];
    try {
        (0, types_1.assertIsApCollection)(collection);
        const firstCollectionPageId = (0, utilities_1.getId)(collection.first);
        if (firstCollectionPageId) {
            const firstCollectionPage = await this.queryById(firstCollectionPageId);
            try {
                (0, types_1.assertIsApTypeOf)(firstCollectionPage, Object.values(types_1.AP.CollectionPageTypes));
                let nextCollectionPage = firstCollectionPage;
                while (nextCollectionPage) {
                    try {
                        (0, types_1.assertIsApTypeOf)(nextCollectionPage, Object.values(types_1.AP.CollectionPageTypes));
                        const collectionPageItems = nextCollectionPage.orderedItems || nextCollectionPage.items;
                        (0, types_1.assertIsArray)(collectionPageItems);
                        collectionItems.push(collectionPageItems);
                        const nextCollectionPageId = (0, utilities_1.getId)(nextCollectionPage.next);
                        (0, types_1.assertExists)(nextCollectionPageId);
                        const potentialNextCollectionPage = await this.queryById(nextCollectionPageId);
                        (0, types_1.assertIsApTypeOf)(potentialNextCollectionPage, Object.values(types_1.AP.CollectionPageTypes));
                        nextCollectionPage = potentialNextCollectionPage;
                    }
                    catch (error) {
                        nextCollectionPage = null;
                    }
                }
            }
            catch (error) { }
        }
        else {
            if (Array.isArray(collection.orderedItems)) {
                collectionItems.push(collection.orderedItems);
            }
            else if (Array.isArray(collection.items)) {
                collectionItems.push(collection.items);
            }
        }
        return collectionItems.flat();
    }
    catch (error) {
        return [];
    }
}
exports.getPaginatedCollectionItems = getPaginatedCollectionItems;
//# sourceMappingURL=getPaginatedCollectionItems.js.map