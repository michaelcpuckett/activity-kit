"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJsonToEntity = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const globals_1 = require("./globals");
/**
 * Converts a JSON object to an Entity with deserialized values.
 *
 * @returns The Entity, or null if not an Entity.
 */
function convertJsonToEntity(object) {
    var _a;
    return (_a = type_utilities_1.cast.isApEntity(convertObject(object))) !== null && _a !== void 0 ? _a : null;
}
exports.convertJsonToEntity = convertJsonToEntity;
/**
 * Deserializes serialized values in an object into their proper types.
 *
 * @returns The object with deserialized values.
 */
function convertObject(object) {
    const converted = {};
    for (const [key, value] of Object.entries(object)) {
        converted[key] = convertUnknown(value);
    }
    return converted;
}
/**
 * Deserializes an unknown value into a known type.
 *
 * @returns The deserialized value.
 */
function convertUnknown(value) {
    if (!type_utilities_1.guard.exists(value)) {
        return value;
    }
    if (type_utilities_1.guard.isArray(value)) {
        return value.map(convertUnknown);
    }
    if (type_utilities_1.guard.isPlainObject(value)) {
        return convertObject(value);
    }
    if (type_utilities_1.guard.isString(value)) {
        if (value === 'as:Public') {
            return new URL(globals_1.PUBLIC_ACTOR);
        }
        try {
            if (value.startsWith('http')) {
                return new URL(value);
            }
            else {
                const date = Date.parse(value);
                if (!Number.isNaN(date)) {
                    return new Date(date);
                }
                return value;
            }
        }
        catch (error) {
            return value;
        }
    }
    return value;
}
//# sourceMappingURL=convertJsonToEntity.js.map