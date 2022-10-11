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
exports.convertFromJsonLd = void 0;
const jsonld = __importStar(require("jsonld"));
const globals_1 = require("./globals");
const convertStringsToUrls_1 = require("./convertStringsToUrls");
const convertFromJsonLd = async (entity) => {
    const result = await jsonld.compact(entity, {
        '@context': globals_1.ACTIVITYSTREAMS_CONTEXT,
    });
    if (!result) {
        return null;
    }
    const converted = (0, convertStringsToUrls_1.convertStringsToUrls)(result);
    if (!converted) {
        return null;
    }
    return converted;
};
exports.convertFromJsonLd = convertFromJsonLd;
//# sourceMappingURL=convertFromJsonLd.js.map