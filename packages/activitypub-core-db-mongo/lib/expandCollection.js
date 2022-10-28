"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandCollection = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function expandCollection(collection) {
    const id = (0, activitypub_core_utilities_1.getId)(collection);
    if (!id) {
        return null;
    }
    const foundThing = await this.queryById(id);
    if (!foundThing) {
        return null;
    }
    const foundCollection = (0, activitypub_core_utilities_1.getTypedEntity)(foundThing);
    const items = await this.getCollectionItems(foundCollection);
    if (!items) {
        return foundCollection;
    }
    if ((0, activitypub_core_utilities_1.isType)(foundCollection, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
        const orderedCollection = (0, activitypub_core_utilities_1.getTypedEntity)(foundCollection);
        return {
            ...orderedCollection,
            orderedItems: items,
        };
    }
    if ((0, activitypub_core_utilities_1.isType)(foundCollection, activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
        const collection = (0, activitypub_core_utilities_1.getTypedEntity)(foundCollection);
        return {
            ...collection,
            items,
        };
    }
    return null;
}
exports.expandCollection = expandCollection;
//# sourceMappingURL=expandCollection.js.map