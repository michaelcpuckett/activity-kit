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
exports.isApTypeOf = exports.isApType = exports.isApTransitiveActivity = exports.isApCollection = exports.isApActor = exports.isApExtendedObject = exports.isApCoreObject = exports.isApActivity = exports.isApEntity = exports.hasApType = exports.hasType = exports.isArray = exports.isUrl = exports.isDate = exports.isBoolean = exports.isNumber = exports.isString = exports.isPlainObject = exports.isObject = exports.exists = void 0;
const guard = __importStar(require("./guard"));
function exists(value) {
    if (!guard.exists(value)) {
        throw new Error(`"${value}" is undefined or null.`);
    }
}
exports.exists = exists;
function isObject(value) {
    if (!guard.isObject(value)) {
        throw new Error(`"${value}" is not an object.`);
    }
}
exports.isObject = isObject;
function isPlainObject(value) {
    if (!guard.isPlainObject(value)) {
        throw new Error(`"${value}" is not a plain object.`);
    }
}
exports.isPlainObject = isPlainObject;
function isString(value) {
    if (!guard.isString(value)) {
        throw new Error(`"${value}" is not a string.`);
    }
}
exports.isString = isString;
function isNumber(value) {
    if (!guard.isNumber(value)) {
        throw new Error(`"${value}" is not a number.`);
    }
}
exports.isNumber = isNumber;
function isBoolean(value) {
    if (!guard.isBoolean(value)) {
        throw new Error(`"${value}" is not a boolean.`);
    }
}
exports.isBoolean = isBoolean;
function isDate(value) {
    if (!guard.isDate(value)) {
        throw new Error(`"${value}" is not a Date object.`);
    }
}
exports.isDate = isDate;
function isUrl(value) {
    if (!guard.isUrl(value)) {
        throw new Error(`"${value}" is not a URL object.`);
    }
}
exports.isUrl = isUrl;
function isArray(value) {
    if (!guard.isArray(value)) {
        throw new Error(`"${value}" is not an array.`);
    }
}
exports.isArray = isArray;
function hasType(value) {
    if (!guard.hasType(value)) {
        throw new Error(`"${value}" has no type.`);
    }
}
exports.hasType = hasType;
function hasApType(value) {
    if (!guard.hasApType(value)) {
        throw new Error(`"${value}" type is not an ActivityPub type.`);
    }
}
exports.hasApType = hasApType;
function isApEntity(value) {
    if (!guard.isApEntity(value)) {
        throw new Error(`"${value}" is not an ActivityPub entity.`);
    }
}
exports.isApEntity = isApEntity;
function isApActivity(value) {
    if (!guard.isApActivity(value)) {
        throw new Error(`"${value}" is not an Activity`);
    }
}
exports.isApActivity = isApActivity;
function isApCoreObject(value) {
    if (!guard.isApCoreObject(value)) {
        throw new Error(`"${value}" is not a Core Object`);
    }
}
exports.isApCoreObject = isApCoreObject;
function isApExtendedObject(value) {
    if (!guard.isApExtendedObject(value)) {
        throw new Error(`"${value}" is not an Extended Object`);
    }
}
exports.isApExtendedObject = isApExtendedObject;
function isApActor(value) {
    if (!guard.isApActor(value)) {
        throw new Error(`"${value}" is not an Actor`);
    }
}
exports.isApActor = isApActor;
function isApCollection(value) {
    if (!guard.isApCollection(value)) {
        throw new Error(`"${value}" is not a Collection`);
    }
}
exports.isApCollection = isApCollection;
function isApTransitiveActivity(value) {
    if (!guard.isApTransitiveActivity(value)) {
        throw new Error(`"${value}" is not a Transitive Activity`);
    }
}
exports.isApTransitiveActivity = isApTransitiveActivity;
function isApType(value, type) {
    if (!guard.isApType(value, type)) {
        throw new Error(`"${value}" is not of type ${type}.`);
    }
}
exports.isApType = isApType;
function isApTypeOf(value, comparison) {
    if (!guard.isApTypeOf(value, comparison)) {
        throw new Error(`"${value}" does not match any provided type.`);
    }
}
exports.isApTypeOf = isApTypeOf;
//# sourceMappingURL=assert.js.map