"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getId = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
/**
 * Get the URL from an EntityReference.
 *
 * @returns The URL, or null if not a URL.
 */
const getId = (entity) => {
    if (!type_utilities_1.guard.exists(entity)) {
        return null;
    }
    if (type_utilities_1.guard.isUrl(entity)) {
        return entity;
    }
    if (type_utilities_1.guard.isPlainObject(entity)) {
        if ('id' in entity && type_utilities_1.guard.isUrl(entity.id)) {
            return entity.id;
        }
        if ('url' in entity && type_utilities_1.guard.isUrl(entity.url)) {
            return entity.url;
        }
        if ('href' in entity && type_utilities_1.guard.isUrl(entity.href)) {
            return entity.href;
        }
    }
    return null;
};
exports.getId = getId;
//# sourceMappingURL=getId.js.map