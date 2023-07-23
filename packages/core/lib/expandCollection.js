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
exports.expandCollection = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
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
    if (type_utilities_1.guard.isTypeOf(foundEntity, AP.CollectionTypes)) {
        const items = await this.getCollectionItems(foundEntity);
        if (!items) {
            return foundEntity;
        }
        if (Array.isArray(foundEntity.type)
            ? foundEntity.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
            : foundEntity.type === AP.CollectionTypes.ORDERED_COLLECTION) {
            return {
                ...foundEntity,
                orderedItems: items,
            };
        }
        if (Array.isArray(foundEntity.type)
            ? foundEntity.type.includes(AP.CollectionTypes.COLLECTION)
            : foundEntity.type === AP.CollectionTypes.COLLECTION) {
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