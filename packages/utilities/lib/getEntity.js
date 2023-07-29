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
exports.getEntity = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const getEntity = (entity) => {
    var _a, _b;
    if (!type_utilities_1.guard.exists(entity)) {
        return null;
    }
    if (type_utilities_1.guard.isUrl(entity)) {
        return null;
    }
    if (type_utilities_1.guard.isArray(entity)) {
        if (entity.length === 1) {
            const [item] = entity;
            return (_a = type_utilities_1.cast.isApTypeOf(item, AP.AllTypes)) !== null && _a !== void 0 ? _a : null;
        }
        return null;
    }
    return (_b = type_utilities_1.cast.isApTypeOf(entity, AP.AllTypes)) !== null && _b !== void 0 ? _b : null;
};
exports.getEntity = getEntity;
//# sourceMappingURL=getEntity.js.map