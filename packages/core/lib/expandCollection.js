"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandCollection = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
async function expandCollection(collection) {
    const expandedCollection = {
        ...collection,
    };
    if (isArray(collection.orderedItems)) {
        const expandPromises = collection.orderedItems
            .filter(isEntityReference)
            .map(queryItem.bind(this));
        const expanded = await Promise.all(expandPromises);
        expandedCollection.orderedItems = expanded;
    }
    if (isArray(collection.items)) {
        const expandPromises = collection.items
            .filter(isEntityReference)
            .map(queryItem.bind(this));
        const expanded = await Promise.all(expandPromises);
        expandedCollection.items = expanded;
    }
    return expandedCollection;
}
exports.expandCollection = expandCollection;
function isEntityReference(value) {
    return type_utilities_1.guard.isApEntity(value) || type_utilities_1.guard.isUrl(value);
}
function isArray(items) {
    return type_utilities_1.guard.isArray(items) && items.length > 0;
}
async function queryItem(item) {
    if (type_utilities_1.guard.isApEntity(item)) {
        return item;
    }
    const cachedItem = await this.queryById(item);
    return cachedItem !== null && cachedItem !== void 0 ? cachedItem : item;
}
//# sourceMappingURL=expandCollection.js.map