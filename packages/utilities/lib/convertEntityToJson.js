"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEntityToJson = void 0;
function convertEntityToJson(object) {
    return convertObject(object);
}
exports.convertEntityToJson = convertEntityToJson;
function convertObject(object) {
    const converted = {};
    for (const [key, value] of Object.entries(object)) {
        converted[key] = convertItem(value);
    }
    return converted;
}
function convertItem(item) {
    if (item instanceof URL || item instanceof Date) {
        return item.toString();
    }
    else if (Array.isArray(item)) {
        return item.map(convertItem);
    }
    else if (item && typeof item === 'object') {
        const object = {};
        for (const objectKey of Object.keys(item)) {
            if (typeof objectKey === 'string') {
                object[objectKey] = item[objectKey];
            }
        }
        return convertObject(object);
    }
    else {
        return item;
    }
}
//# sourceMappingURL=convertEntityToJson.js.map