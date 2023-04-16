"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandCollection = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function expandCollection(collection) {
    const id = (0, utilities_1.getId)(collection);
    if (!id) {
        return null;
    }
    const foundEntity = await this.queryById(id);
    if (!foundEntity) {
        return null;
    }
    try {
        (0, types_1.assertIsApCollection)(foundEntity);
        const items = await this.getCollectionItems(foundEntity);
        if (!items) {
            return foundEntity;
        }
        if ((0, utilities_1.isType)(foundEntity, types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
            return {
                ...foundEntity,
                orderedItems: items,
            };
        }
        if ((0, utilities_1.isType)(foundEntity, types_1.AP.CollectionTypes.COLLECTION)) {
            return {
                ...foundEntity,
                items,
            };
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
exports.expandCollection = expandCollection;
//# sourceMappingURL=expandCollection.js.map