"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEntityToJson = void 0;
const superjson_1 = require("superjson");
const convertEntityToJson = (entity) => {
    return JSON.parse((0, superjson_1.stringify)(entity)).json;
};
exports.convertEntityToJson = convertEntityToJson;
//# sourceMappingURL=convertEntityToJson.js.map