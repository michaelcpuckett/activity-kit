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
exports.isApTypeOf = exports.isApType = exports.isApTransitiveActivity = exports.isApCollection = exports.isApActor = exports.isApExtendedObject = exports.isApCoreObject = exports.isApActivity = exports.isApEntity = exports.hasApType = exports.hasType = exports.isArray = exports.isDate = exports.isNumber = exports.isString = exports.isObject = exports.exists = void 0;
const guard = __importStar(require("./guard"));
function exists(value) {
    return guard.exists(value) ? value : undefined;
}
exports.exists = exists;
function isObject(value) {
    return guard.isObject(value) ? value : undefined;
}
exports.isObject = isObject;
function isString(value) {
    return guard.isString(value) ? value : undefined;
}
exports.isString = isString;
function isNumber(value) {
    return guard.isNumber(value) ? value : undefined;
}
exports.isNumber = isNumber;
function isDate(value) {
    return guard.isDate(value) ? value : undefined;
}
exports.isDate = isDate;
function isArray(value) {
    return guard.isArray(value) ? value : undefined;
}
exports.isArray = isArray;
function hasType(value) {
    return guard.hasType(value) ? value : undefined;
}
exports.hasType = hasType;
function hasApType(value) {
    return guard.hasApType(value) ? value : undefined;
}
exports.hasApType = hasApType;
function isApEntity(value) {
    return guard.isApEntity(value) ? value : undefined;
}
exports.isApEntity = isApEntity;
function isApActivity(value) {
    return guard.isApActivity(value) ? value : undefined;
}
exports.isApActivity = isApActivity;
function isApCoreObject(value) {
    return guard.isApCoreObject(value) ? value : undefined;
}
exports.isApCoreObject = isApCoreObject;
function isApExtendedObject(value) {
    return guard.isApExtendedObject(value) ? value : undefined;
}
exports.isApExtendedObject = isApExtendedObject;
function isApActor(value) {
    return guard.isApActor(value) ? value : undefined;
}
exports.isApActor = isApActor;
function isApCollection(value) {
    return guard.isApCollection(value) ? value : undefined;
}
exports.isApCollection = isApCollection;
function isApTransitiveActivity(value) {
    return guard.isApTransitiveActivity(value) ? value : undefined;
}
exports.isApTransitiveActivity = isApTransitiveActivity;
function isApType(value, type) {
    return guard.isType(value, type) ? value : undefined;
}
exports.isApType = isApType;
function isApTypeOf(value, comparison) {
    return guard.isTypeOf(value, comparison) ? value : undefined;
}
exports.isApTypeOf = isApTypeOf;
//# sourceMappingURL=cast.js.map