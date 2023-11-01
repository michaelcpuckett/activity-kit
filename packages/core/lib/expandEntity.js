"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandEntity = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
/**
 * Keys that should not be expanded.
 */
const selfReferentialKeys = [
    '@context',
    '_id',
    'id',
    'type',
    'url',
    'href',
    'publicKey',
];
/**
 * Convert an Entity to a full object, expanding any references to other
 * Entities.
 *
 * @returns A Promise that resolves to the expanded Entity.
 */
async function expandEntity(entity) {
    var _a;
    return (_a = type_utilities_1.cast.isApEntity(await expandObject.bind(this)(entity))) !== null && _a !== void 0 ? _a : entity;
}
exports.expandEntity = expandEntity;
/**
 * Expand all references in an object.
 *
 * @returns A Promise that resolves to an object with all references expanded.
 */
async function expandObject(object) {
    const expanded = {};
    for (const [key, value] of Object.entries(object)) {
        expanded[key] = await expandEntry.bind(this)([key, value]);
    }
    return expanded;
}
/**
 * Expand a single entry in an object, which may be a reference to another
 * Entity.
 *
 * @returns A Promise that resolves to the expanded entry in the object.
 */
async function expandEntry(entry) {
    const [key, value] = entry;
    if (selfReferentialKeys.includes(key)) {
        return value;
    }
    if (type_utilities_1.guard.isArray(value)) {
        return await Promise.all(value.map(async (item) => await expandEntry.bind(this)([key, item])));
    }
    if (type_utilities_1.guard.isPlainObject(value)) {
        return await expandObject.bind(this)(value);
    }
    if (type_utilities_1.guard.isUrl(value)) {
        const foundEntity = type_utilities_1.cast.isApEntity(await this.queryById(value));
        if (foundEntity) {
            return foundEntity;
        }
    }
    return value;
}
//# sourceMappingURL=expandEntity.js.map