"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionItems = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getCollectionItems(entity) {
    const id = (0, activitypub_core_utilities_1.getId)(entity);
    if (!id) {
        return [];
    }
    const collection = await this.queryById(id);
    if (!collection) {
        return [];
    }
    if (!(0, activitypub_core_utilities_1.isType)(collection, activitypub_core_types_1.AP.CollectionTypes.COLLECTION) &&
        !(0, activitypub_core_utilities_1.isType)(collection, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
        return [];
    }
    if (!(('items' in collection && Array.isArray(collection.items)) ||
        ('orderedItems' in collection && Array.isArray(collection.orderedItems)))) {
        return [];
    }
    const collectionItems = (0, activitypub_core_utilities_1.isType)(collection, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)
        ? collection.orderedItems
        : collection.items;
    if (!Array.isArray(collectionItems)) {
        return [];
    }
    const result = [];
    for (const item of collectionItems) {
        if (item instanceof URL) {
            const foundEntity = await this.queryById(item);
            result.push(foundEntity
                ? await this.expandEntity(foundEntity)
                : {
                    type: activitypub_core_types_1.AP.CoreObjectTypes.TOMBSTONE,
                    content: 'Not found',
                });
        }
        else if (!Array.isArray(item) && item.id instanceof URL) {
            const foundEntity = await this.queryById(item.id);
            result.push(foundEntity ?? item);
        }
    }
    return result;
}
exports.getCollectionItems = getCollectionItems;
//# sourceMappingURL=getCollectionItems.js.map