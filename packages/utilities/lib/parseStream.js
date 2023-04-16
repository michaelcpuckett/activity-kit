"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStream = void 0;
const convertFromJsonLd_1 = require("./convertFromJsonLd");
const streamToString_1 = require("./streamToString");
async function parseStream(req) {
    return await (0, convertFromJsonLd_1.convertFromJsonLd)(JSON.parse(await (0, streamToString_1.streamToString)(req)));
}
exports.parseStream = parseStream;
//# sourceMappingURL=parseStream.js.map