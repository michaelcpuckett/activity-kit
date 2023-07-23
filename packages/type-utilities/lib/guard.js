"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isApTypeOf = exports.isApType = exports.isApTransitiveActivity = exports.isApCollection = exports.isApActor = exports.isApExtendedObject = exports.isApCoreObject = exports.isApActivity = exports.isApEntity = exports.hasApType = exports.hasType = exports.isArray = exports.isDate = exports.isNumber = exports.isString = exports.isObject = exports.exists = exports.isTypeOf = exports.isType = void 0;
const AP = __importStar(require("@activity-kit/types"));
function isType(entity, type) {
    if (!entity || typeof entity !== 'object') {
        return false;
    }
    const entityType = entity.type;
    return Array.isArray(entityType)
        ? entityType.includes(type)
        : type === entityType;
}
exports.isType = isType;
function isTypeOf(entity, types) {
    return Object.values(types).some((type) => isType(entity, type));
}
exports.isTypeOf = isTypeOf;
function exists(value) {
    if (typeof value === 'undefined' || value === null) {
        return false;
    }
    return true;
}
exports.exists = exists;
function isObject(value) {
    return !!value && typeof value === 'object';
}
exports.isObject = isObject;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
exports.isNumber = isNumber;
function isDate(value) {
    return value instanceof Date;
}
exports.isDate = isDate;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function hasType(value) {
    return isObject(value) && 'type' in value;
}
exports.hasType = hasType;
function hasApType(value) {
    return hasType(value) && isTypeOf(value, AP.AllTypes);
}
exports.hasApType = hasApType;
function isApEntity(value) {
    return hasApType(value);
}
exports.isApEntity = isApEntity;
function isApActivity(value) {
    return isApEntity(value) && isTypeOf(value, AP.ActivityTypes);
}
exports.isApActivity = isApActivity;
function isApCoreObject(value) {
    return (isApEntity(value) && isTypeOf(value, AP.CoreObjectTypes));
}
exports.isApCoreObject = isApCoreObject;
function isApExtendedObject(value) {
    return (isApEntity(value) &&
        isTypeOf(value, AP.ExtendedObjectTypes));
}
exports.isApExtendedObject = isApExtendedObject;
function isApActor(value) {
    return isApEntity(value) && isTypeOf(value, AP.ActorTypes);
}
exports.isApActor = isApActor;
function isApCollection(value) {
    return (isApEntity(value) &&
        isTypeOf(value, AP.CollectionTypes));
}
exports.isApCollection = isApCollection;
function isApTransitiveActivity(value) {
    return isApActivity(value) && 'object' in value;
}
exports.isApTransitiveActivity = isApTransitiveActivity;
function isApType(value, type) {
    return isApEntity(value) && isType(value, type);
}
exports.isApType = isApType;
function isApTypeOf(value, comparison) {
    return isApEntity(value) && isTypeOf(value, comparison);
}
exports.isApTypeOf = isApTypeOf;
//# sourceMappingURL=guard.js.map