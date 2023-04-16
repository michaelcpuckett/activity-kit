"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = void 0;
const cleanProps_1 = require("./cleanProps");
const convertUrlsToStrings_1 = require("./convertUrlsToStrings");
function stringify(entity) {
    return JSON.stringify((0, convertUrlsToStrings_1.convertUrlsToStrings)((0, cleanProps_1.cleanProps)(entity)));
}
exports.stringify = stringify;
//# sourceMappingURL=stringify.js.map