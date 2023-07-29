"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressEntity = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
function compressEntity(entity) {
    var _a;
    return (_a = type_utilities_1.cast.isApEntity(compressObject(entity))) !== null && _a !== void 0 ? _a : null;
}
exports.compressEntity = compressEntity;
function compressObject(object) {
    const compressed = {};
    for (const [key, value] of Object.entries(object)) {
        compressed[key] = compressUnknown(value);
    }
    return compressed;
}
function compressUnknown(item) {
    if (!type_utilities_1.guard.exists(item)) {
        return item;
    }
    if (type_utilities_1.guard.isArray(item)) {
        return item.map(compressUnknown);
    }
    const entity = type_utilities_1.cast.isApEntity(item);
    if (!entity) {
        return item;
    }
    if ('id' in entity && type_utilities_1.guard.isUrl(entity.id)) {
        return entity.id;
    }
    if ('url' in entity && type_utilities_1.guard.isUrl(entity.url)) {
        return entity.url;
    }
    if ('href' in entity && type_utilities_1.guard.isUrl(entity.href)) {
        return entity.href;
    }
    return entity;
}
//# sourceMappingURL=compressEntity.js.map