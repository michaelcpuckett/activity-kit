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
    if ((0, types_1.isTypeOf)(foundEntity, types_1.AP.CollectionTypes)) {
        const items = await this.getCollectionItems(foundEntity);
        if (!items) {
            return foundEntity;
        }
        if (Array.isArray(foundEntity.type)
            ? foundEntity.type.includes(types_1.AP.CollectionTypes.ORDERED_COLLECTION)
            : foundEntity.type === types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
            return {
                ...foundEntity,
                orderedItems: items,
            };
        }
        if (Array.isArray(foundEntity.type)
            ? foundEntity.type.includes(types_1.AP.CollectionTypes.COLLECTION)
            : foundEntity.type === types_1.AP.CollectionTypes.COLLECTION) {
            return {
                ...foundEntity,
                items,
            };
        }
    }
    return null;
}
exports.expandCollection = expandCollection;
//# sourceMappingURL=expandCollection.js.map