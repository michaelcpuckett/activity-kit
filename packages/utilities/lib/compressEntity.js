"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressEntity = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
/**
 * Compresses an Entity by replacing all nested Entities with their URLs.
 *
 * This is useful for storing Entities in a database, as it removes the need to
 * store the entire Entity, or for sending Entities over the network, as it
 * reduces the size of the payload.
 *
 * @note This follows rules similar to JSON-LD compaction, but it does not
 * follow the JSON-LD spec exactly. For example, it does not use the `@context`
 * property to determine the full URL of a property.
 *
 * @returns The compressed Entity, or null if not an Entity.
 */
function compressEntity(entity) {
    var _a;
    return (_a = type_utilities_1.cast.isApEntity(compressObject(entity))) !== null && _a !== void 0 ? _a : null;
}
exports.compressEntity = compressEntity;
/**
 * Compresses an object by replacing all nested Entities with their URLs.
 *
 * @returns The compressed object.
 */
function compressObject(object) {
    const compressed = {};
    for (const [key, value] of Object.entries(object)) {
        compressed[key] = compressUnknown(value);
    }
    return compressed;
}
/**
 * Compresses an unknown value by replacing all nested Entities with their
 * URLs.
 *
 * @returns The compressed value.
 */
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