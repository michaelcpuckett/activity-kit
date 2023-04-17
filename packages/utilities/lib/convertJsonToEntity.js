"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJsonToEntity = void 0;
const types_1 = require("@activity-kit/types");
const globals_1 = require("./globals");
function convertJsonToEntity(object) {
    const converted = convertObject(object);
    try {
        (0, types_1.assertIsApEntity)(converted);
        return converted;
    }
    catch (error) {
        return null;
    }
}
exports.convertJsonToEntity = convertJsonToEntity;
function convertObject(object) {
    const converted = {};
    for (const [key, value] of Object.entries(object)) {
        converted[key] = convertItem(value);
    }
    return converted;
}
function convertItem(item) {
    if (item instanceof URL || item instanceof Date) {
        return item;
    }
    else if (typeof item === 'string') {
        if (item === 'as:Public') {
            return new URL(globals_1.PUBLIC_ACTOR);
        }
        try {
            if (item.startsWith('http')) {
                return new URL(item);
            }
            else {
                const date = Date.parse(item);
                if (!Number.isNaN(date)) {
                    return new Date(date);
                }
            }
        }
        catch (error) {
            return item;
        }
    }
    else if (Array.isArray(item)) {
        return item.map(convertItem);
    }
    else if (typeof item === 'object') {
        const object = {};
        for (const objectKey of Object.keys(item)) {
            if (typeof objectKey === 'string') {
                object[objectKey] = item[objectKey];
            }
        }
        return convertObject(object);
    }
}
//# sourceMappingURL=convertJsonToEntity.js.map