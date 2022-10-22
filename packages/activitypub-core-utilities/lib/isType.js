"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isType = exports.isTypeOf = void 0;
const getTypedEntity_1 = require("./getTypedEntity");
function isTypeOf(entity, values) {
    for (const type of Object.values(values)) {
        const typedObject = (0, getTypedEntity_1.getTypedEntity)(entity);
        if (Array.isArray(typedObject.type)
            ? typedObject.type.includes(type)
            : type === typedObject.type) {
            return true;
        }
    }
    return false;
}
exports.isTypeOf = isTypeOf;
function isType(entity, type) {
    const typedObject = (0, getTypedEntity_1.getTypedEntity)(entity);
    const typedObjectType = typedObject;
    if (Array.isArray(typedObjectType)
        ? typedObjectType.includes(type)
        : type === typedObject.type) {
        return true;
    }
    return false;
}
exports.isType = isType;
//# sourceMappingURL=isType.js.map