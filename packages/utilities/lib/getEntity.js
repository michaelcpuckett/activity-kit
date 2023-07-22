"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntity = void 0;
const getEntity = (entity) => {
    if (!entity) {
        return null;
    }
    if (entity instanceof URL) {
        return null;
    }
    if (Array.isArray(entity)) {
        if (entity.length === 1) {
            if (entity[0] instanceof URL) {
                return null;
            }
            return entity[0];
        }
        return null;
    }
    return entity;
};
exports.getEntity = getEntity;
//# sourceMappingURL=getEntity.js.map