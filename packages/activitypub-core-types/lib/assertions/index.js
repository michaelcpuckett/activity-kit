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
exports.assertIsApType = exports.assertIsApTransitiveActivity = exports.assertIsApCollection = exports.assertIsApActor = exports.assertIsApExtendedObject = exports.assertIsApActivity = exports.assertIsApEntity = exports.assertHasApType = exports.assertHasType = exports.assertIsArray = exports.assertIsObject = exports.assertExists = exports.isType = exports.isTypeOf = void 0;
const AP = __importStar(require("../activitypub"));
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
function assertExists(value) {
    if (typeof value === 'undefined' || value === null) {
        throw new Error(`\`${value}\` is undefined or null.`);
    }
}
exports.assertExists = assertExists;
function assertIsObject(value) {
    if (typeof value !== 'object') {
        throw new Error(`\`${value}\` is not an object`);
    }
}
exports.assertIsObject = assertIsObject;
function assertIsArray(value) {
    if (!Array.isArray(value)) {
        throw new Error(`\`${value}\` is not an array`);
    }
}
exports.assertIsArray = assertIsArray;
function assertHasType(value) {
    assertIsObject(value);
    if (!('type' in value)) {
        throw new Error(`\`${value}\` has no type.`);
    }
}
exports.assertHasType = assertHasType;
function assertHasApType(value) {
    assertHasType(value);
    if (!isTypeOf(value, AP.AllTypes)) {
        throw new Error(`\`${value}\` type is not an ActivityPub type.`);
    }
}
exports.assertHasApType = assertHasApType;
function assertIsApEntity(value) {
    assertHasApType(value);
}
exports.assertIsApEntity = assertIsApEntity;
function assertIsApActivity(value) {
    assertIsApEntity(value);
    if (!isTypeOf(value, AP.ActivityTypes)) {
        throw new Error(`\`${value}\` is not an Activity`);
    }
}
exports.assertIsApActivity = assertIsApActivity;
function assertIsApExtendedObject(value) {
    assertIsApEntity(value);
    if (!isTypeOf(value, AP.ExtendedObjectTypes)) {
        throw new Error(`\`${value}\` is not an Extended Object`);
    }
}
exports.assertIsApExtendedObject = assertIsApExtendedObject;
function assertIsApActor(value) {
    assertIsApEntity(value);
    if (!isTypeOf(value, AP.ActorTypes)) {
        throw new Error(`\`${value}\` is not an Actor`);
    }
}
exports.assertIsApActor = assertIsApActor;
function assertIsApCollection(value) {
    assertIsApEntity(value);
    if (!isTypeOf(value, AP.CollectionTypes)) {
        throw new Error(`\`${value}\` is not a Collection`);
    }
}
exports.assertIsApCollection = assertIsApCollection;
function assertIsApTransitiveActivity(value) {
    assertIsApActivity(value);
    if (!('object' in value)) {
        throw new Error(`\`${value}\` is not a TransitiveActivity.`);
    }
}
exports.assertIsApTransitiveActivity = assertIsApTransitiveActivity;
function assertIsApType(value, comparison) {
    assertIsApEntity(value);
    if (!isType(value, comparison)) {
        throw new Error(`\`${value}\` is not of type ${comparison}`);
    }
}
exports.assertIsApType = assertIsApType;
//# sourceMappingURL=index.js.map