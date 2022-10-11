"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyWithContext = void 0;
const addContext_1 = require("./addContext");
const cleanProps_1 = require("./cleanProps");
const convertUrlsToStrings_1 = require("./convertUrlsToStrings");
function stringifyWithContext(entity) {
    return JSON.stringify((0, convertUrlsToStrings_1.convertUrlsToStrings)((0, addContext_1.addContext)((0, cleanProps_1.cleanProps)(entity))));
}
exports.stringifyWithContext = stringifyWithContext;
//# sourceMappingURL=stringifyWithContext.js.map