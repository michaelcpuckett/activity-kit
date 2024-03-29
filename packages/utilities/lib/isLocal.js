"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocal = void 0;
const getCollectionNameByUrl_1 = require("./getCollectionNameByUrl");
/**
 * Determines whether a URL is local or not.
 *
 * @returns True if local, false if foreign.
 */
function isLocal(url) {
    return (0, getCollectionNameByUrl_1.getCollectionNameByUrl)(url) !== 'foreignEntity';
}
exports.isLocal = isLocal;
//# sourceMappingURL=isLocal.js.map