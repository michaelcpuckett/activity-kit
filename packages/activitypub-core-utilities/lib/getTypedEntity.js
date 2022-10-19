"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypedEntity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const getTypedEntity = (entity) => {
    for (const linkType of Object.values(activitypub_core_types_1.AP.LinkTypes)) {
        if (entity.type === linkType ||
            (Array.isArray(entity.type) && entity.type.includes(linkType))) {
            return entity;
        }
    }
    for (const activityType of Object.values(activitypub_core_types_1.AP.ActivityTypes)) {
        if (entity.type === activityType ||
            (Array.isArray(entity.type) && entity.type.includes(activityType))) {
            return entity;
        }
    }
    for (const actorType of Object.values(activitypub_core_types_1.AP.ActorTypes)) {
        if (entity.type === actorType ||
            (Array.isArray(entity.type) && entity.type.includes(actorType))) {
            return entity;
        }
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION ||
        (Array.isArray(entity.type) &&
            entity.type.includes(activitypub_core_types_1.AP.CollectionTypes.COLLECTION))) {
        return entity;
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION ||
        (Array.isArray(entity.type) &&
            entity.type.includes(activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION))) {
        return entity;
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE ||
        (Array.isArray(entity.type) &&
            entity.type.includes(activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE))) {
        return entity;
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE ||
        (Array.isArray(entity.type) &&
            entity.type.includes(activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE))) {
        return entity;
    }
    for (const extendedObjectType of Object.values(activitypub_core_types_1.AP.ExtendedObjectTypes)) {
        if (entity.type === extendedObjectType ||
            (Array.isArray(entity.type) && entity.type.includes(extendedObjectType))) {
            return entity;
        }
    }
    return null;
};
exports.getTypedEntity = getTypedEntity;
//# sourceMappingURL=getTypedEntity.js.map