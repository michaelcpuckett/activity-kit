"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getId = void 0;
const getId = (entity) => {
    if (!entity || Array.isArray(entity)) {
        return null;
    }
    if (entity instanceof URL) {
        return entity;
    }
    if ('id' in entity) {
        return entity.id ?? null;
    }
    if ('url' in entity) {
        if (entity.url instanceof URL) {
            return entity.url;
        }
        if (Array.isArray(entity.url)) {
            return null;
        }
        return entity.url.href ?? null;
    }
    if ('href' in entity) {
        return entity.href ?? null;
    }
    return null;
};
exports.getId = getId;
//# sourceMappingURL=getId.js.map