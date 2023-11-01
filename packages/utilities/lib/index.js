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
exports.isLocal = exports.getEntity = exports.getId = exports.getCollectionNameByUrl = exports.convertEntityToJson = exports.convertJsonToEntity = exports.compactJsonObject = exports.compressEntity = exports.cleanProps = exports.applyContext = void 0;
__exportStar(require("./globals"), exports);
var applyContext_1 = require("./applyContext");
Object.defineProperty(exports, "applyContext", { enumerable: true, get: function () { return applyContext_1.applyContext; } });
var cleanProps_1 = require("./cleanProps");
Object.defineProperty(exports, "cleanProps", { enumerable: true, get: function () { return cleanProps_1.cleanProps; } });
var compressEntity_1 = require("./compressEntity");
Object.defineProperty(exports, "compressEntity", { enumerable: true, get: function () { return compressEntity_1.compressEntity; } });
var compactJsonObject_1 = require("./compactJsonObject");
Object.defineProperty(exports, "compactJsonObject", { enumerable: true, get: function () { return compactJsonObject_1.compactJsonObject; } });
var convertJsonToEntity_1 = require("./convertJsonToEntity");
Object.defineProperty(exports, "convertJsonToEntity", { enumerable: true, get: function () { return convertJsonToEntity_1.convertJsonToEntity; } });
var convertEntityToJson_1 = require("./convertEntityToJson");
Object.defineProperty(exports, "convertEntityToJson", { enumerable: true, get: function () { return convertEntityToJson_1.convertEntityToJson; } });
var getCollectionNameByUrl_1 = require("./getCollectionNameByUrl");
Object.defineProperty(exports, "getCollectionNameByUrl", { enumerable: true, get: function () { return getCollectionNameByUrl_1.getCollectionNameByUrl; } });
var getId_1 = require("./getId");
Object.defineProperty(exports, "getId", { enumerable: true, get: function () { return getId_1.getId; } });
var getEntity_1 = require("./getEntity");
Object.defineProperty(exports, "getEntity", { enumerable: true, get: function () { return getEntity_1.getEntity; } });
var isLocal_1 = require("./isLocal");
Object.defineProperty(exports, "isLocal", { enumerable: true, get: function () { return isLocal_1.isLocal; } });
//# sourceMappingURL=index.js.map