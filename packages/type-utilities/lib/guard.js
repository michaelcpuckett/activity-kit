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
exports.isApTypeOf = exports.isApType = exports.isApTransitiveActivity = exports.isApCollectionPage = exports.isApCollection = exports.isApActor = exports.isApExtendedObject = exports.isApCoreObject = exports.isApActivity = exports.isApEntity = exports.hasApType = exports.hasType = exports.isArray = exports.isUrl = exports.isDate = exports.isBoolean = exports.isNumber = exports.isString = exports.isPlainObject = exports.isObject = exports.exists = void 0;
const narrow = __importStar(require("./narrow"));
function exists(value) {
    return narrow.exists(value);
}
exports.exists = exists;
function isObject(value) {
    return narrow.isObject(value);
}
exports.isObject = isObject;
function isPlainObject(value) {
    return narrow.isPlainObject(value);
}
exports.isPlainObject = isPlainObject;
function isString(value) {
    return narrow.isString(value);
}
exports.isString = isString;
function isNumber(value) {
    return narrow.isNumber(value);
}
exports.isNumber = isNumber;
function isBoolean(value) {
    return narrow.isBoolean(value);
}
exports.isBoolean = isBoolean;
function isDate(value) {
    return narrow.isDate(value);
}
exports.isDate = isDate;
function isUrl(value) {
    return narrow.isUrl(value);
}
exports.isUrl = isUrl;
function isArray(value) {
    return narrow.isArray(value);
}
exports.isArray = isArray;
function hasType(value) {
    return narrow.hasType(value);
}
exports.hasType = hasType;
function hasApType(value) {
    return narrow.hasApType(value);
}
exports.hasApType = hasApType;
function isApEntity(value) {
    return narrow.isApEntity(value);
}
exports.isApEntity = isApEntity;
function isApActivity(value) {
    return narrow.isApActivity(value);
}
exports.isApActivity = isApActivity;
function isApCoreObject(value) {
    return narrow.isApCoreObject(value);
}
exports.isApCoreObject = isApCoreObject;
function isApExtendedObject(value) {
    return narrow.isApExtendedObject(value);
}
exports.isApExtendedObject = isApExtendedObject;
function isApActor(value) {
    return narrow.isApActor(value);
}
exports.isApActor = isApActor;
function isApCollection(value) {
    return narrow.isApCollection(value);
}
exports.isApCollection = isApCollection;
function isApCollectionPage(value) {
    return narrow.isApCollectionPage(value);
}
exports.isApCollectionPage = isApCollectionPage;
function isApTransitiveActivity(value) {
    return narrow.isApTransitiveActivity(value);
}
exports.isApTransitiveActivity = isApTransitiveActivity;
function isApType(value, type) {
    return narrow.isApType(value, type);
}
exports.isApType = isApType;
function isApTypeOf(value, comparison) {
    return narrow.isApTypeOf(value, comparison);
}
exports.isApTypeOf = isApTypeOf;
//# sourceMappingURL=guard.js.map