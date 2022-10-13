"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressEntity = void 0;
function compressEntity(entity) {
    const compressed = { ...entity };
    for (const [key, value] of Object.entries(entity)) {
        if (value instanceof URL || value instanceof Date || typeof value === 'string') {
            continue;
        }
        else if (Array.isArray(value)) {
            compressed[key] = compressArray(value);
        }
        else if (value &&
            typeof value === 'object' &&
            'id' in value &&
            value.id instanceof URL) {
            compressed[key] = value.id;
        }
        else {
            continue;
        }
    }
    return compressed;
}
exports.compressEntity = compressEntity;
function compressArray(array) {
    return array.map((item) => {
        if (item instanceof URL || item instanceof Date || typeof item === 'string') {
            return item;
        }
        else if (Array.isArray(item)) {
            return compressArray(item);
        }
        else if (typeof item === 'object' &&
            'id' in item &&
            item.id instanceof URL) {
            return item.id;
        }
        else {
            return item;
        }
    });
}
//# sourceMappingURL=compressEntity.js.map