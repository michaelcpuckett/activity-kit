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
exports.expandEntity = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function expandEntity(entity) {
    const expandEntry = async (key, value) => {
        if (key === '_id' ||
            key === 'id' ||
            key === 'url' ||
            key === 'type' ||
            key === '@context' ||
            key === 'publicKey') {
            return value;
        }
        else if (value instanceof URL) {
            if (value.toString() === utilities_1.PUBLIC_ACTOR) {
                return value;
            }
            else {
                try {
                    const foundEntity = await this.queryById(value);
                    return foundEntity ?? value;
                }
                catch (error) {
                    return value;
                }
            }
        }
        else if (Array.isArray(value)) {
            return await Promise.all(value.map(async (item) => await expandEntry('', item)));
        }
        else {
            return value;
        }
    };
    const expanded = {};
    for (const [key, value] of Object.entries(entity)) {
        expanded[key] = await expandEntry(key, value);
    }
    if (type_utilities_1.guard.isTypeOf(expanded, AP.AllTypes)) {
        return expanded;
    }
    return null;
}
exports.expandEntity = expandEntity;
//# sourceMappingURL=expandEntity.js.map