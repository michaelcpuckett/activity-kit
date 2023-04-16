"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUrlsToStrings = void 0;
const superjson_1 = require("superjson");
const convertUrlsToStrings = (entity) => {
    return JSON.parse((0, superjson_1.stringify)(entity)).json;
};
exports.convertUrlsToStrings = convertUrlsToStrings;
//# sourceMappingURL=convertUrlsToStrings.js.map