"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandCollection = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const expandCollection = async function expandCollection(collection) {
    const items = this.getCollectionItems(collection);
    const expandedItems = await Promise.all(items.map(async (item) => {
        var _a;
        if (type_utilities_1.guard.isApEntity(item)) {
            return item;
        }
        return (_a = (await this.queryById(item))) !== null && _a !== void 0 ? _a : item;
    }));
    if (type_utilities_1.guard.isArray(collection.orderedItems) &&
        collection.orderedItems.length) {
        return {
            ...collection,
            orderedItems: expandedItems,
        };
    }
    else if (type_utilities_1.guard.isArray(collection.items) && collection.items.length) {
        return {
            ...collection,
            items: expandedItems,
        };
    }
    return collection;
};
exports.expandCollection = expandCollection;
//# sourceMappingURL=expandCollection.js.map