"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressEntity = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
function compressEntity(entity) {
    const object = {};
    for (const key of Object.keys(entity)) {
        if (typeof key === 'string') {
            object[key] = entity[key];
        }
    }
    const compressed = compressObject(object);
    try {
        type_utilities_1.assert.isApEntity(compressed);
        return compressed;
    }
    catch (error) {
        return null;
    }
}
exports.compressEntity = compressEntity;
function compressObject(object) {
    const compressed = {};
    for (const [key, value] of Object.entries(object)) {
        compressed[key] = compressItem(value);
    }
    return compressed;
}
function compressItem(item) {
    if (item instanceof URL || item instanceof Date || typeof item === 'string') {
        return item;
    }
    else if (Array.isArray(item)) {
        return item.map(compressItem);
    }
    else if (item && typeof item === 'object') {
        if ('id' in item && item.id instanceof URL) {
            return item.id;
        }
        else if ('href' in item && item.href instanceof URL) {
            return item.href;
        }
        else if ('url' in item) {
            if (item.url instanceof URL) {
                return item.url;
            }
            else if (typeof item.url === 'object' &&
                'href' in item.url &&
                item.url.href instanceof URL) {
                return item.url.href;
            }
            else {
                return item;
            }
        }
        else {
            const object = {};
            for (const objectKey of Object.keys(item)) {
                if (typeof objectKey === 'string') {
                    object[objectKey] = item[objectKey];
                }
            }
            return compressObject(object);
        }
    }
    else {
        return item;
    }
}
//# sourceMappingURL=compressEntity.js.map