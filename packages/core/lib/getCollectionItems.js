"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionItems = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const getCollectionItems = function getCollectionItems(entity) {
    const collectionItems = [];
    if (type_utilities_1.guard.isArray(entity.orderedItems) && entity.orderedItems.length) {
        const orderedItems = entity.orderedItems.filter((item) => {
            return type_utilities_1.guard.isApEntity(item) || type_utilities_1.guard.isUrl(item);
        });
        collectionItems.push(...orderedItems);
    }
    else if (type_utilities_1.guard.isArray(entity.items) && entity.items.length) {
        const items = entity.items.filter((item) => {
            return type_utilities_1.guard.isApEntity(item) || type_utilities_1.guard.isUrl(item);
        });
        collectionItems.push(...items);
    }
    return collectionItems;
};
exports.getCollectionItems = getCollectionItems;
//# sourceMappingURL=getCollectionItems.js.map