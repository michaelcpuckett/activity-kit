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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypedEntity = exports.isType = exports.isTypeOf = exports.getHttpSignature = exports.stringify = exports.streamToString = exports.removeContext = exports.parseStream = exports.getId = exports.getGuid = exports.getCollectionNameByUrl = exports.generateKeyPair = exports.convertUrlsToStrings = exports.convertStringsToUrls = exports.convertFromJsonLd = exports.compressEntity = exports.combineAddresses = exports.cleanProps = exports.applyContext = void 0;
__exportStar(require("./globals"), exports);
var applyContext_1 = require("./applyContext");
Object.defineProperty(exports, "applyContext", { enumerable: true, get: function () { return applyContext_1.applyContext; } });
var cleanProps_1 = require("./cleanProps");
Object.defineProperty(exports, "cleanProps", { enumerable: true, get: function () { return cleanProps_1.cleanProps; } });
var combineAddresses_1 = require("./combineAddresses");
Object.defineProperty(exports, "combineAddresses", { enumerable: true, get: function () { return combineAddresses_1.combineAddresses; } });
var compressEntity_1 = require("./compressEntity");
Object.defineProperty(exports, "compressEntity", { enumerable: true, get: function () { return compressEntity_1.compressEntity; } });
var convertFromJsonLd_1 = require("./convertFromJsonLd");
Object.defineProperty(exports, "convertFromJsonLd", { enumerable: true, get: function () { return convertFromJsonLd_1.convertFromJsonLd; } });
var convertStringsToUrls_1 = require("./convertStringsToUrls");
Object.defineProperty(exports, "convertStringsToUrls", { enumerable: true, get: function () { return convertStringsToUrls_1.convertStringsToUrls; } });
var convertUrlsToStrings_1 = require("./convertUrlsToStrings");
Object.defineProperty(exports, "convertUrlsToStrings", { enumerable: true, get: function () { return convertUrlsToStrings_1.convertUrlsToStrings; } });
var generateKeyPair_1 = require("./generateKeyPair");
Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function () { return generateKeyPair_1.generateKeyPair; } });
var getCollectionNameByUrl_1 = require("./getCollectionNameByUrl");
Object.defineProperty(exports, "getCollectionNameByUrl", { enumerable: true, get: function () { return getCollectionNameByUrl_1.getCollectionNameByUrl; } });
var getGuid_1 = require("./getGuid");
Object.defineProperty(exports, "getGuid", { enumerable: true, get: function () { return getGuid_1.getGuid; } });
var getId_1 = require("./getId");
Object.defineProperty(exports, "getId", { enumerable: true, get: function () { return getId_1.getId; } });
var parseStream_1 = require("./parseStream");
Object.defineProperty(exports, "parseStream", { enumerable: true, get: function () { return parseStream_1.parseStream; } });
var removeContext_1 = require("./removeContext");
Object.defineProperty(exports, "removeContext", { enumerable: true, get: function () { return removeContext_1.removeContext; } });
var streamToString_1 = require("./streamToString");
Object.defineProperty(exports, "streamToString", { enumerable: true, get: function () { return streamToString_1.streamToString; } });
var stringify_1 = require("./stringify");
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return stringify_1.stringify; } });
var getHttpSignature_1 = require("./getHttpSignature");
Object.defineProperty(exports, "getHttpSignature", { enumerable: true, get: function () { return getHttpSignature_1.getHttpSignature; } });
var isType_1 = require("./isType");
Object.defineProperty(exports, "isTypeOf", { enumerable: true, get: function () { return isType_1.isTypeOf; } });
Object.defineProperty(exports, "isType", { enumerable: true, get: function () { return isType_1.isType; } });
var getTypedEntity_1 = require("./getTypedEntity");
Object.defineProperty(exports, "getTypedEntity", { enumerable: true, get: function () { return getTypedEntity_1.getTypedEntity; } });
//# sourceMappingURL=index.js.map