"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEntityToJson = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
/**
 * Converts an Entity to a plain JSON object.
 *
 * This is needed to store the Entity in a database or send it over the network,
 * as the Entity may contain URLs, Dates, and other non-JSON values.
 *
 * @returns The plain object.
 *
 * @todo The fallthrough case for objects relies on the `toString()` method.
 * This is not ideal, as it may not always produce the desired result.
 */
function convertEntityToJson(object) {
    var _a;
    return (_a = type_utilities_1.cast.isPlainObject(convertObject(object))) !== null && _a !== void 0 ? _a : {};
}
exports.convertEntityToJson = convertEntityToJson;
/**
 * Converts an object to a plain JSON object.
 *
 * @returns The plain object.
 */
function convertObject(object) {
    const converted = {};
    for (const [key, value] of Object.entries(object)) {
        converted[key] = convertUnknown(value);
    }
    return converted;
}
/**
 * Converts an unknown value to a plain JSON value.
 *
 * @returns The plain value.
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
    if (type_utilities_1.guard.isDate(value)) {
        return value.toISOString();
    }
    if (type_utilities_1.guard.isObject(value)) {
        return value.toString();
    }
    return value;
}
//# sourceMappingURL=convertEntityToJson.js.map