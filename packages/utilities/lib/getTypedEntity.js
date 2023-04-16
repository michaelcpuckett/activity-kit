"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypedEntity = void 0;
const types_1 = require("@activity-kit/types");
const isType_1 = require("./isType");
const getTypedEntity = (entity) => {
    if ((0, isType_1.isTypeOf)(entity, types_1.AP.LinkTypes)) {
        return entity;
    }
    if ((0, isType_1.isTypeOf)(entity, types_1.AP.ActivityTypes)) {
        return entity;
    }
    if ((0, isType_1.isTypeOf)(entity, types_1.AP.ActorTypes)) {
        return entity;
    }
    if ((0, isType_1.isType)(entity, types_1.AP.CollectionTypes.COLLECTION)) {
        return entity;
    }
    if ((0, isType_1.isType)(entity, types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
        return entity;
    }
    if ((0, isType_1.isType)(entity, types_1.AP.CollectionPageTypes.COLLECTION_PAGE)) {
        return entity;
    }
    if ((0, isType_1.isType)(entity, types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE)) {
        return entity;
    }
    if ((0, isType_1.isTypeOf)(entity, types_1.AP.ExtendedObjectTypes)) {
        return entity;
    }
    console.log(entity);
    console.log('^-- entity is null?');
    return null;
};
exports.getTypedEntity = getTypedEntity;
//# sourceMappingURL=getTypedEntity.js.map