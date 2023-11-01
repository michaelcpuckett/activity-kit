"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedCollectionItems = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
/**
 * Given a Collection or OrderedCollection, traverse its pages and return all
 * items.
 *
 * This is useful for getting all items in a foreign Collection, which may be
 * paginated.
 *
 * @returns A Promise that resolves to an array of all items in the Collection.
 */
async function getPaginatedCollectionItems(collection) {
    const firstCollectionPageId = (0, utilities_1.getId)(collection.first);
    if (!firstCollectionPageId) {
        // TODO .getArray()
        if (type_utilities_1.guard.isArray(collection.orderedItems)) {
            return collection.orderedItems;
        }
        if (type_utilities_1.guard.isArray(collection.items)) {
            return collection.items;
        }
        return [];
    }
    const firstCollectionPage = await this.queryById(firstCollectionPageId);
    if (!type_utilities_1.guard.isApTypeOf(firstCollectionPage, AP.CollectionPageTypes)) {
        return [];
    }
    const collectionItems = [];
    let nextCollectionPage = firstCollectionPage;
    while (nextCollectionPage) {
        if (type_utilities_1.guard.isArray(nextCollectionPage.orderedItems)) {
            collectionItems.push(nextCollectionPage.orderedItems);
        }
        if (type_utilities_1.guard.isArray(nextCollectionPage.items)) {
            collectionItems.push(nextCollectionPage.items);
        }
        const nextPageId = (0, utilities_1.getId)(nextCollectionPage.next);
        if (!type_utilities_1.guard.exists(nextPageId)) {
            break;
        }
        const nextPage = await this.queryById(nextPageId);
        if (!type_utilities_1.guard.isApTypeOf(nextPage, AP.CollectionPageTypes)) {
            break;
        }
        nextCollectionPage = nextPage;
    }
    return collectionItems.flat();
}
exports.getPaginatedCollectionItems = getPaginatedCollectionItems;
//# sourceMappingURL=getPaginatedCollectionItems.js.map