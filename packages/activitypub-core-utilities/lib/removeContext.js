"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeContext = void 0;
function removeContext(entity) {
    const result = { ...entity };
    if ('@context' in result) {
        delete result['@context'];
    }
    for (const [key, value] of Object.entries(result)) {
        if (key === '@context') {
            delete result['@context'];
        }
        else if (Array.isArray(value)) {
            result[key] = value.map(handleArrayItem);
        }
        else if (typeof value === 'object') {
            result[key] = removeContext(value);
        }
    }
    return result;
}
exports.removeContext = removeContext;
function handleArrayItem(item) {
    if (Array.isArray(item)) {
        return item.map(handleArrayItem);
    }
    else if (item && typeof item === 'object') {
        return removeContext(item);
    }
    else {
        return item;
    }
}
//# sourceMappingURL=removeContext.js.map