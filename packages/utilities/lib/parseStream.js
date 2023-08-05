"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStream = void 0;
const convertJsonLdToEntity_1 = require("./convertJsonLdToEntity");
const streamToString_1 = require("./streamToString");
/**
 * Parse an HTTP stream into an Entity.
 *
 * @returns The Entity, or null if not found.
 *
 * @todo This is being depricated in favor of having adapters handle this.
 */
async function parseStream(req) {
    return await (0, convertJsonLdToEntity_1.convertJsonLdToEntity)(JSON.parse(await (0, streamToString_1.streamToString)(req)));
}
exports.parseStream = parseStream;
//# sourceMappingURL=parseStream.js.map