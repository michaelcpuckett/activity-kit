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
async function getPaginatedCollectionItems(collection) {
    const collectionItems = [];
    try {
        (0, type_utilities_1.assertIsApCollection)(collection);
        const firstCollectionPageId = (0, utilities_1.getId)(collection.first);
        if (firstCollectionPageId) {
            const firstCollectionPage = await this.queryById(firstCollectionPageId);
            try {
                (0, type_utilities_1.assertIsApTypeOf)(firstCollectionPage, AP.CollectionPageTypes);
                let nextCollectionPage = firstCollectionPage;
                while (nextCollectionPage) {
                    try {
                        (0, type_utilities_1.assertIsApTypeOf)(nextCollectionPage, AP.CollectionPageTypes);
                        const collectionPageItems = nextCollectionPage.orderedItems || nextCollectionPage.items;
                        (0, type_utilities_1.assertIsArray)(collectionPageItems);
                        collectionItems.push(collectionPageItems);
                        const nextCollectionPageId = (0, utilities_1.getId)(nextCollectionPage.next);
                        (0, type_utilities_1.assertExists)(nextCollectionPageId);
                        const potentialNextCollectionPage = await this.queryById(nextCollectionPageId);
                        (0, type_utilities_1.assertIsApTypeOf)(potentialNextCollectionPage, AP.CollectionPageTypes);
                        nextCollectionPage = potentialNextCollectionPage;
                    }
                    catch (error) {
                        nextCollectionPage = null;
                    }
                }
            }
            catch (error) { }
        }
        else {
            if (Array.isArray(collection.orderedItems)) {
                collectionItems.push(collection.orderedItems);
            }
            else if (Array.isArray(collection.items)) {
                collectionItems.push(collection.items);
            }
        }
        return collectionItems.flat();
    }
    catch (error) {
        return [];
    }
}
exports.getPaginatedCollectionItems = getPaginatedCollectionItems;
//# sourceMappingURL=getPaginatedCollectionItems.js.map