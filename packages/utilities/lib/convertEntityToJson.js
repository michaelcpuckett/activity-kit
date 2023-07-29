"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEntityToJson = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
function convertEntityToJson(object) {
    var _a;
    return (_a = type_utilities_1.cast.isPlainObject(convertObject(object))) !== null && _a !== void 0 ? _a : {};
}
exports.convertEntityToJson = convertEntityToJson;
function convertObject(object) {
    const converted = {};
    for (const [key, value] of Object.entries(object)) {
        converted[key] = convertUnknown(value);
    }
    return converted;
}
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