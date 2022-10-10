"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypedEntity = void 0;
const types_1 = require("../types");
const getTypedEntity = (entity) => {
    for (const linkType of Object.values(types_1.AP.LinkTypes)) {
        if (entity.type === linkType) {
            return entity;
        }
    }
    for (const activityType of Object.values(types_1.AP.ActivityTypes)) {
        if (entity.type === activityType) {
            return entity;
        }
    }
    for (const actorType of Object.values(types_1.AP.ActorTypes)) {
        if (entity.type === actorType) {
            return entity;
        }
    }
    if (entity.type === types_1.AP.CollectionTypes.COLLECTION) {
        return entity;
    }
    if (entity.type === types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
        return entity;
    }
    if (entity.type === types_1.AP.CollectionPageTypes.COLLECTION_PAGE) {
        return entity;
    }
    if (entity.type === types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE) {
        return entity;
    }
    for (const objectType of Object.values(types_1.AP.ExtendedObjectTypes)) {
        if (entity.type === objectType) {
            return entity;
        }
    }
    return null;
};
exports.getTypedEntity = getTypedEntity;
//# sourceMappingURL=getTypedEntity.js.map