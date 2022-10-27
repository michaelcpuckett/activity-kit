"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isType = exports.isTypeOf = void 0;
function isTypeOf(entity, values) {
    for (const type of Object.values(values)) {
        if (isType(entity, type)) {
            return true;
        }
    }
    return false;
}
exports.isTypeOf = isTypeOf;
function isType(entity, type) {
    if (Array.isArray(entity.type)
        ? entity.type.includes(type)
        : type === entity.type) {
        return true;
    }
    return false;
}
exports.isType = isType;
//# sourceMappingURL=isType.js.map