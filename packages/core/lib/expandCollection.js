"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandCollection = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
/**
 * Given a Collection or OrderedCollection, convert its item/orderedItem
 * references to be full entities.
 *
 * @returns A Promise that resolves to the expanded Collection.
 */
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
/**
 * Determine if a value is an EntityReference.
 */
function isEntityReference(value) {
    return type_utilities_1.guard.isApEntity(value) || type_utilities_1.guard.isUrl(value);
}
/**
 * Determine if a value is an array of EntityReferences.
 *
 * @returns Boolean representing whether the value is an array of
 * EntityReferences.
 */
function isArray(items) {
    return type_utilities_1.guard.isArray(items) && items.length > 0;
}
/**
 * Query an EntityReference and return the full Entity.
 *
 * If the EntityReference is already an Entity, it will be returned as-is.
 *
 * @returns A Promise that resolves to the full Entity.
 */
async function queryItem(item) {
    if (type_utilities_1.guard.isApEntity(item)) {
        return item;
    }
    const cachedItem = await this.queryById(item);
    return cachedItem !== null && cachedItem !== void 0 ? cachedItem : item;
}
//# sourceMappingURL=expandCollection.js.map