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
exports.getCollectionItems = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function getCollectionItems(entity) {
    try {
        type_utilities_1.assert.isApCollection(entity);
        const collectionItems = entity.orderedItems || entity.items;
        if (!Array.isArray(collectionItems)) {
            return [];
        }
        const result = [];
        for (const item of collectionItems) {
            if (item instanceof URL) {
                const foundItem = await this.queryById(item);
                result.push(foundItem
                    ? await this.expandEntity(foundItem)
                    : {
                        id: item,
                        type: AP.CoreObjectTypes.TOMBSTONE,
                        content: 'Not found',
                    });
            }
            else if (!Array.isArray(item)) {
                const foundItem = await this.queryById((0, utilities_1.getId)(item));
                result.push(foundItem ?? item);
            }
        }
        return result;
    }
    catch (error) {
        return [];
    }
}
exports.getCollectionItems = getCollectionItems;
//# sourceMappingURL=getCollectionItems.js.map