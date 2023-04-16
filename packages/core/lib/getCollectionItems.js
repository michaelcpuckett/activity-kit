"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionItems = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function getCollectionItems(entity) {
    try {
        (0, types_1.assertIsApCollection)(entity);
        const collectionItems = entity.orderedItems || entity.items;
        if (!Array.isArray(collectionItems)) {
            return [];
        }
        const result = [];
        for (const item of collectionItems) {
            if (item instanceof URL) {
                const foundItem = await this.queryById(item);
                result.push(foundItem
                    ? await this.expandEntity(foundItem)
                    : {
                        type: types_1.AP.CoreObjectTypes.TOMBSTONE,
                        content: 'Not found',
                    });
            }
            else if (!Array.isArray(item)) {
                const foundItem = await this.queryById((0, utilities_1.getId)(item));
                result.push(foundItem ?? item);
            }
        }
        return result;
    }
    catch (error) {
        return [];
    }
}
exports.getCollectionItems = getCollectionItems;
//# sourceMappingURL=getCollectionItems.js.map