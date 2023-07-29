"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJsonToEntity = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const globals_1 = require("./globals");
function convertJsonToEntity(object) {
    var _a;
    return (_a = type_utilities_1.cast.isApEntity(convertObject(object))) !== null && _a !== void 0 ? _a : null;
}
exports.convertJsonToEntity = convertJsonToEntity;
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