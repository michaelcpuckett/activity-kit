"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStream = void 0;
const convertJsonLdToEntity_1 = require("./convertJsonLdToEntity");
const streamToString_1 = require("./streamToString");
async function parseStream(req) {
    return await (0, convertJsonLdToEntity_1.convertJsonLdToEntity)(JSON.parse(await (0, streamToString_1.streamToString)(req)));
}
exports.parseStream = parseStream;
//# sourceMappingURL=parseStream.js.map